import SearchBar from "./searchbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
interface Latest {
  author: { name: string };
  title: string;
  authorId: number;
  id: number;
  createdAt: string;
  published: boolean;
  updatedAt: string;
}
export default function NavBar() {
  const router = useRouter();
  const [latest, setLatest] = useState<Latest>(null as any);
  const [latestHover, setLatestHover] = useState(false);
  const [latestBanner, setLatestBanner] = useState(null as any);
  const [showLatest, setShowLatest] = useState(false);
  const [user, setUser] = useState(null as any);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    fetch("/api/posts?id=latest")
      .then((res) => res.json())
      .then((data) => {
        // router.push(`/posts/${data.post.id}`);
        // console.log(data);
        if (data !== null) {
          setLatest(data);
          setShowLatest(true);
          try {
            JSON.parse(data.content).find((item: any) => {
              if (item.type === "banner") {
                setLatestBanner(item);
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
  }, []);

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
          const tmp = data;
          delete tmp.message;
          setUser(tmp);
          if (data.admin === true) {
            setAdmin(true);
          } else {
            window.location.href = `/login?redirect=${encodeURIComponent(
              "/admin"
            )}`;
          }
        });
    }
  }, []);
  return (
    <div className="w-full h-16 bg-gray-200 px-3 py-3 flex gap-4 text-white relative justify-center">
      <div className="flex max-w-5xl w-full gap-4 relative justify-between">
        <div className="flex gap-4 relative">
          <NavLink href="/" text="Home" />
          <NavLink href="/posts" text="Posts" />
          {showLatest && (
            <button
              className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium relative flex items-center"
              onMouseOver={() => {
                setLatestHover(true);
              }}
              onMouseLeave={() => {
                setLatestHover(false);
              }}
              onClick={() => {
                router.push(`/posts/${latest.id}`);
              }}
            >
              Latest Post
              <div className="absolute top-10 left-10 z-50">
                {latestHover && latest && (
                  <>
                    {latest.id && (
                      <div className="bg-gray-200 text-black rounded-md p-2 shadow-xl w-64 text-left hover:bg-gray-300">
                        <a href={`/posts/${latest.id}`} className="w-full">
                          <div className="text-lg">{latest.title}</div>
                          <div className="text-sm">
                            Author: {latest.author.name}
                          </div>
                          {latestBanner && (
                            <img
                              src={latestBanner.src}
                              alt=""
                              className="rounded-md"
                            />
                          )}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </button>
          )}
        </div>
        <div className="h-full flex gap-4 relative ">
          {admin && (
            <>
              <NavLink href="/admin" text="Admin" admin />
              <NavLink href="/admin/editor" text="Editor" admin />
              <div className="h-full flex items-center text-black ">
                {user && (
                  <div className="flex justify-center flex-col text-right">
                    <div className="">Signed in as {user.name}</div>
                    <div>{user.email}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* <div className="absolute right-0 top-0 h-16 py-3">
        <SearchBar />
      </div> */}
    </div>
  );
}

interface NavLinkProps {
  href: string;
  text: string;
  admin?: boolean;
}
function NavLink({ href, text, admin }: NavLinkProps) {
  let className;
  if (admin) {
    className =
      "text-white bg-red-500 hover:bg-red-700 px-4 rounded-md text-sm font-medium flex items-center";
  } else {
    className =
      "text-white bg-blue-500 hover:bg-blue-700 px-4 rounded-md text-sm font-medium flex items-center";
  }

  return (
    <a href={href} className={className}>
      {text}
    </a>
  );
}
