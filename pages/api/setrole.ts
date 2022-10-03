import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // set the admin setting of the user with email alexng353@gmail.com to true
  prisma.user
    .update({
      where: {
        email: "alexng353@gmail.com",
      },
      data: {
        admin: true,
      },
    })
    .then(() => {
      res.status(200).json({ message: "success" });
    });
}
