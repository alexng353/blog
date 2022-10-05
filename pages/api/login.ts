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
      select: {
        id: true,
        password: true,
        email: true,
        admin: true,
        name: true,
      },
    });

    // hash password sha256
    const hash = crypto.createHash("sha256").update(password).digest("hex");

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (user.password !== hash) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(200).json({
      message: "success",
      admin: user.admin,
      name: user.name,
      email: user.email,
    });
  }
}
