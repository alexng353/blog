import SearchBar from "./searchbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function NavBar() {
  const router = useRouter();
  const [latest, setLatest] = useState<any>(null as any);
  const [latestHover, setLatestHover] = useState(false);
  const [latestBanner, setLatestBanner] = useState(null as any);
  useEffect(() => {
    fetch("/api/posts?id=latest")
      .then((res) => res.json())
      .then((data) => {
        // router.push(`/posts/${data.post.id}`);
        // console.log(data);
        setLatest(data);
        JSON.parse(data.content).find((item: any) => {
          if (item.type === "banner") {
            setLatestBanner(item);
          }
        });
      });
  }, []);
  return (
    <div className="w-full h-16 bg-gray-200 px-3 py-3 flex gap-4 text-white relative">
      <NavLink href="/" text="Home" />
      <NavLink href="/posts" text="Posts" />
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
        <div className="absolute top-10 left-10">
          {latestHover && latest && (
            <div className="bg-gray-200 text-black rounded-md p-2 shadow-xl w-64 text-left hover:bg-gray-300">
              <a href={`/posts/${latest.id}`} className="w-full">
                <div className="text-lg">{latest.title}</div>
                <div className="text-sm">Author: {latest.author.name}</div>
                {latestBanner && (
                  <img src={latestBanner.src} alt="" className="rounded-md" />
                )}
              </a>
            </div>
          )}
        </div>
      </button>

      {/* <div className="absolute right-0 top-0 h-16 py-3">
        <SearchBar />
      </div> */}
    </div>
  );
}

interface NavLinkProps {
  href: string;
  text: string;
}
function NavLink({ href, text }: NavLinkProps) {
  return (
    <a
      href={href}
      className="text-white bg-blue-500 hover:bg-blue-700 px-4 rounded-md text-sm font-medium flex items-center"
    >
      {text}
    </a>
  );
}