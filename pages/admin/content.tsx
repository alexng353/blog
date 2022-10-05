import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Content = dynamic(() => import("components/admin/content"), {
  ssr: false,
});

export default function ContentManager() {
  const [data, setData] = useState<any[]>([]);


  return (
    <div className="min-h-screen text-black w-full flex justify-center">
      <div className="max-w-4xl w-full">
        <Content />
      </div>
    </div>
  );
}
