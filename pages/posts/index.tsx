import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const DateRender = dynamic(() => import("../../components/posts/daterender"), {
  ssr: false,
});

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
    // limit to 50 posts
    take: 50,
    // sort by date
    orderBy: {
      createdAt: "desc",
    },
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
  prisma.$disconnect();
  let posts = tmp.map((post) => {
    // console.log(post.author);

    return {
      ...post,
      createdAt: post.createdAt.toString(),
      updatedAt: post.updatedAt.toString(),
    };
  });

  return {
    props: { posts },
    revalidate: 10,
  };
}

export default function Posts({ posts }: any) {
  // console.log(posts);
  const router = useRouter();
  const [data, setData] = useState(posts);
  const [show, setShow] = useState(false);
  // ?page=n
  const page = Number(router.query.page);
  useEffect(() => {
    if (page) {
      // const start = (page - 1) * 50;
      // const stop = start + 50;
      const start = (page - 1) * 50;
      const take = 50;

      fetch(`http://localhost:3000/api/posts?n=${start}&content=true&s=${take}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          setData(data);
        });
    }
    setTimeout(() => {
      setShow(true);
    }, 150);
  }, [page]);
  return (
    <div className="w-full mb-10">
      {show && (
        <>
          <div className="flex justify-center w-full">
            <div className="max-w-5xl w-full">
              <h1 className="text-4xl font-bold">Posts</h1>
              {data.map((post: any) => {
                const creation = new Date(post.createdAt);
                // custom date format, include time to minute accuracy
                return (
                  <a
                    href={`/posts/${post.id}`}
                    key={post.id}
                    className="flex flex-col w-full p-4 my-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
                  >
                    <h1>{post.title}</h1>
                    <p>Author: {post.author?.name}</p>
                    <DateRender date={creation} />
                  </a>
                );
              })}

              {data && data.length < 1 && (
                <div className="w-full flex justify-center">
                  <p>No posts found</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center mt-8">
            <div className="w-[512px] flex justify-between ">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48"
                onClick={() => {
                  // page must be bigger than 1
                  if (page > 1) {
                    router.push(`/posts?page=${page - 1}`);
                  }
                }}
              >
                previous page
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48"
                onClick={() => {
                  if (!page) {
                    router.push(`/posts?page=2`);
                  } else {
                    router.push(`/posts?page=${page + 1}`);
                  }
                }}
              >
                next page
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
