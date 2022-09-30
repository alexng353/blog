import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // change password
  if (req.method === "POST") {
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
      const user = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: req.body.newpassword,
        },
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
