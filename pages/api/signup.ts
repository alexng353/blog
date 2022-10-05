// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import crypto from 'crypto'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { data } = req.body
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: crypto
            .createHash('sha256')
            .update(data.password)
            .digest('hex'),
        },
      })
      prisma.$disconnect()
      res.status(200).json({ user })
    } catch (error) {
      prisma.$disconnect()
      res.status(500).json({ error })
    }
  } else {
    prisma.$disconnect()
    res.status(405).json({ error: 'Method not allowed' })
  }
}
