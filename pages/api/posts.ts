// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { n, s, content, id } = req.query

  if (id) {
    if (id === 'latest') {
      prisma.post
        .findFirst({
          orderBy: {
            id: 'desc',
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        })
        .then((post) => {
          res.status(200).json(post)
        })
      prisma.$disconnect()
      return
    } else {
      prisma.post
        .findUnique({
          where: {
            id: Number(id),
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        })
        .then((post) => {
          res.status(200).json(post)
        })
      prisma.$disconnect()
      return
    }
  }
  // sort posts by createdAt, then return between post n and s
  if (n && s) {
    prisma.post
      .findMany({
        orderBy: {
          createdAt: 'desc',
        },
        // select: {
        //   id: true,
        //   title: true,
        //   content: content === 'false' ? false : true,
        //   createdAt: true,
        //   updatedAt: true,
        //   published: true,
        // },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        skip: Number(n),
        take: Number(s),
      })
      .then((posts) => {
        prisma.$disconnect()
        res.status(200).json(posts)
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  } else {
    prisma.post
      .findMany({
        select: {
          id: true,
          title: true,
          content: content === 'false' ? false : true,
          createdAt: true,
          updatedAt: true,
          published: true,
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: n ? parseInt(n as string) : 10,
      })
      .then((posts) => {
        prisma.$disconnect()
        res.status(200).json({ posts })
      })
  }
}
