import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  //   grab the id from the request
  const { id } = req.query;

  // delete the post at id
  try {
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
}
