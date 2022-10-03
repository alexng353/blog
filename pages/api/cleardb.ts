import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // clear the database
  prisma.post.deleteMany({}).then(() => {
    res.status(200).json({ message: "success" });
  });
}
