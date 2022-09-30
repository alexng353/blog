import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getStaticProps() {
  const tmp = await prisma.user.findMany();
  // turn all the posts[n].createdAt into a string

  let posts = tmp.map((post) => {
    return {
      ...post,
      createdAt: post.createdAt.toString(),
      updatedAt: post.updatedAt.toString(),
    };
  });

  return {
    props: { posts },
  };
}

export default function Post({ post }: any) {
  const router = useRouter();
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
