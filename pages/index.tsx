import { useState } from "react";
import { TextField, Button } from "@mui/material";
import NavBar from "components/navbar";
import { useEffect } from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getStaticProps() {
  // get 3 latest posts
  const tmp = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      published: true,
      content: true,
      author: {
        select: {
          name: true,
        },
      },
    },

    take: 3,
  });

  // serialize createdAt and updatedAt
  let posts = tmp.map((post) => {
    // console.log(post.author);

    return {
      ...post,
      createdAt: post.createdAt.toString(),
      updatedAt: post.updatedAt.toString(),
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Home({ posts }: any) {
  return (
    <>
      <NavBar />

      <div className="min-h-screen text-black w-full flex justify-center gap-4">
        {posts.map((post: any, index: any) => (
          <NewsPreview post={post} key={index} />
        ))}
      </div>
    </>
  );
}

function NewsPreview({ post }: any) {
  const [latestBanner, setLatestBanner] = useState<any>();
  const [firstText, setFirstText] = useState<any>();
  useEffect(() => {
    // parse and sort backwards
    let tmp = JSON.parse(post.content).reverse();
    tmp.find((item: any) => {
      if (item.type === "banner") {
        setLatestBanner(item);
      }
    });
    tmp.find((item: any) => {
      // look for first "text" type
      if (item.type === "text") {
        setFirstText(item);
      }
    });
  }, [post]);
  return (
    <div className="w-96 h-[32rem] bg-gray-200 rounded-md flex flex-col  border border-black">
      <div className="h-48 overflow-hidden flex justify-center items-center">
        {latestBanner && (
          <img
            src={latestBanner.src}
            alt={latestBanner.name}
            className="w-full"
          />
        )}
      </div>
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <h2 className="text-gray-800">
          {post.author.name} -{" "}
          {new Date(post.createdAt)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            // replace "at" with ","
            .replace(" at", ",")}
        </h2>
        <p className="line-clamp-[10]">{firstText?.content}</p>
      </div>

      {/* <p className="text-lg">{post.content}</p> */}
    </div>
  );
}
