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
  // const tmp = await prisma.post.findMany();
  // get all posts, include author name
  const tmp = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          password: false,
        },
      },
    },
  });

  // turn all the posts[n].createdAt into a string

  let posts = tmp.map((post) => {
    console.log(post.author);

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
    <div className="flex justify-center w-full">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold">Posts</h1>
        {posts.map((post: any) => {
          const creation = new Date(post.createdAt);
          // custom date format, include time to minute accuracy
          const creationString = creation.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });

          return (
            <a
              href={`/posts/${post.id}`}
              key={post.id}
              className="flex flex-col w-full p-4 my-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
            >
              <h1>{post.title}</h1>
              <p>Author: {post.author.name}</p>
              <p>{creationString}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
