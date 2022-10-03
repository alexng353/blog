// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  if (!req.headers.authorization) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const auth = Buffer.from(req.headers.authorization, "base64")
    .toString()
    .split(":");
  const [password, email] = auth;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // make sure user is admin

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (user.admin !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  if (user.password !== hash) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error });
  }
}
