import NavBar from "components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "components/loading";
import DateRender from "components/posts/daterender";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("components/admin/chart"), {
  ssr: false,
});

export default function AdminPage() {
  // login
  const [admin, setAdmin] = useState(false);
  const [enableredir, setEnableredir] = useState(false);
  const [user, setUser] = useState(null as any);
  const [data, setData] = useState(null as any);
  const router = useRouter();
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
    setEnableredir(true);
  }, []);
  useEffect(() => {
    if (admin) {
      fetch("/api/posts?n=1000&content=false")
        .then((res) => res.json())
        .then((data) => {
          setData(data.posts); // log out all the views
          console.log(data.posts.map((post: any) => post.views));
        });
    }
  }, [admin]);

  if (admin) {
    return (
      <>
        <NavBar />
        <div className="w-full flex justify-center p-5">
          <div className="w-full max-w-5xl">
            <div>
              <h1>Admin Page</h1>
              <p>
                Logged in as {user.name}: <span>{user.email}</span>
              </p>
            </div>
            <Chart />
            <div className="lg:grid grid-cols-2 gap-x-8">
              {data &&
                data.map((post: any) => {
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
                          <span>Author : {post.author?.name}</span>
                          {admin && (
                            <>
                              <span className="border-l border-black pl-2 ml-3">
                                id : {post.id}
                              </span>
                              <span className="border-l border-black pl-2 ml-3">
                                views : {post.views}
                              </span>
                            </>
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
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Spinner />
    </>
  );
}
