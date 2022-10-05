import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import NavBar from "components/navbar";
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
  const [admin, setAdmin] = useState(false);
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
  useEffect(() => {
    if (localStorage.getItem("basic") !== null) {
      // login
      fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("basic")!,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.admin === true) {
            setAdmin(true);
          }
        });
    }
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full mb-10 p-5">
        {show && (
          <>
            <div className="flex justify-center w-full">
              <div className="max-w-5xl w-full">
                <h1 className="text-4xl font-bold">Posts</h1>
                <div className="lg:grid grid-cols-2 gap-4">
                  {data.map((post: any) => {
                    const creation = new Date(post.createdAt);
                    // custom date format, include time to minute accuracy
                    return (
                      <div className="relative" key={post.id}>
                        <a
                          href={`/posts/${post.id}`}
                          className="flex flex-col w-full p-4 my-4 bg-gray-100 rounded-lg shadow-lg shadow-blue-500 border-blue-500 border hover:bg-gray-200 relative"
                        >
                          <h1 className="font-bold">{post.title}</h1>
                          <p className="flex">
                            <span>Author: {post.author?.name}</span>
                            {admin && (
                              <span className="border-l border-black pl-2 ml-3">
                                id: {post.id}
                              </span>
                            )}
                          </p>
                          <DateRender date={creation} />
                        </a>
                        {admin && (
                          <div className="absolute top-[-6px] lg:top-[8px] right-[-6px]">
                            <a
                              className="bg-purple-500 rounded-md px-4 py-2 shadow-lg shadow-purple-500 text-white hover:bg-purple-700 flex items-center justify-center"
                              href={`/admin/editor?id=${post.id}`}
                            >
                              edit
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {data && data.length < 1 && (
                  <div className="w-full flex justify-center">
                    <p>No posts found</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex justify-center mt-8">
              <div className="max-w-[512px] w-full flex justify-between gap-4">
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
    </>
  );
}
