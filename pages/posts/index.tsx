import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function getStaticPaths() {
//   const posts = await prisma.user.findMany();
//   const paths = posts.map((post) => ({
//     params: { id: post.id.toString() },
//   }));
//   return { paths, fallback: false };
// }

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

export default function Posts({ posts }: any) {
  console.log(posts);

  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}
