import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // grab id from query
  const { id } = req.body;
  console.log(id);

  prisma.post
    .update({
      where: {
        id: Number(id),
      },
      data: {
        views: {
          increment: 1,
        },
      },
    })
    .then((post) => {
      prisma.$disconnect();
      res.status(200).json(post);
    });
}
