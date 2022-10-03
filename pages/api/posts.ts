// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { n } = req.query;
  console.log(n);

  prisma.post
    .findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: n ? parseInt(n as string) : 10,
    })
    .then((posts) => {
      res.status(200).json({ posts });
    });
}
