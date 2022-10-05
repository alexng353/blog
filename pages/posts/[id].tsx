import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";
import Render from "components/render";

const prisma = new PrismaClient();

export async function getStaticPaths() {
  const posts = await prisma.post.findMany();
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  // console.log(posts);
  // console.log(paths);

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: any) {
  // console.log(params);

  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: {
        select: {
          name: true,
          password: false,
        },
      },
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  // replace createdAt and updatedAt with strings
  const postString = {
    ...post,
    createdAt: post.createdAt.toString(),
    updatedAt: post.updatedAt.toString(),
  };
  prisma.$disconnect();
  return {
    props: { postString },
    revalidate: 10,
  };
}

export default function Post({ postString }: any) {
  const post = postString;
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  // console.log(post);

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-5xl">
        <Render fields={JSON.parse(post.content)} />
      </div>
    </div>
  );
}
