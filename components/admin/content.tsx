import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Props {
  author: {
    name: string;
  };
  title: string;
  id: string;
}
type PropList = Props[];
export default function Content() {
  const [data, setData] = useState<PropList>([]);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/posts?n=1000&content=false")
      .then((res) => res.json())
      .then((data) => {
        setData(data.posts);
        console.log(data);
      });
  }, []);
  return (
    <>
      <table>
        <tr className="font-bold text-center">
          <td>Title</td>
          <td className="w-32">View Button</td>
          <td className="w-32">Edit button</td>
          <td className="w-32">Delete button</td>
          <td className="w-32">Author</td>
          <td className="w-12">id</td>
        </tr>
        {data &&
          data.map((post, index) => {
            return (
              <tr key={index}>
                <td>{post.title}</td>
                <td>
                  <div className="w-full flex justify-center">
                    <a
                      className="bg-green-500 hover:bg-green-700 rounded-lg px-4 py-1 text-white"
                      href={`/posts/${post.id}`}
                    >
                      view
                    </a>
                  </div>
                </td>
                <td>
                  <div className="w-full flex justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 rounded-lg px-4 py-1 text-white"
                      onClick={() => {
                        router.push(`/admin/editor?id=${post.id}`);
                      }}
                    >
                      edit
                    </button>
                  </div>
                </td>
                <td>
                  <div className="w-full flex justify-center">
                    <button
                      className="bg-red-500 hover:bg-red-700 rounded-lg px-4 py-1 text-white"
                      onClick={() => {
                        router.push(`/admin/editor?id=${post.id}`);
                      }}
                    >
                      delete
                    </button>
                  </div>
                </td>
                <td>{post.author.name}</td>
                <td className="text-center">{post.id}</td>
              </tr>
            );
          })}
      </table>
    </>
  );
}
