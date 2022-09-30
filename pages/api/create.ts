// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { data, type } = req.body;
    switch (type) {
      case "createUser":
        try {
          const user = await prisma.user.create({
            data: {
              name: data.name,
              email: data.email,
              password: crypto
                .createHash("sha256")
                .update(data.password)
                .digest("hex"),
            },
          });
          res.status(200).json({ user });
        } catch (error) {
          res.status(500).json({ error });
        }
        break;
      case "createPost":
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
        if (!user) {
          res.status(401).json({ error: "Unauthorized" });
          return;
        }
        if (user.password !== password) {
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
                  id: data.authorId,
                },
              },
            },
          });
          res.status(200).json({ post });
        } catch (error) {}
        break;
    }
  } else {
    res.status(500).json({ error: "Invalid method" });
  }
}
