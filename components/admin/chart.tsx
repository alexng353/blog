import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";
import React from "react";
interface TmpData {
  name: string;
  views: number;
}
export default function Chart() {
  const [data, setData] = React.useState<TmpData[]>([]);

  React.useEffect(() => {
    fetch("/api/posts?n=10&content=false")
      .then((res) => res.json())
      .then((data) => {
        // setData(data.posts); // log out all the views
        // console.log(data.posts.map((post: any) => post.views));
        // grab only {title, views} and map into a list
        const tmp = data.posts.map((post: any) => {
          // trim title to max 10 chars
          const title =
            post.title.length > 10
              ? post.title.slice(0, 10) + "..."
              : post.title;
          return { name: post.title, views: post.views };
        });
        setData(tmp);
      });
  }, []);

  // get width of parent element
  const [width, setWidth] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  // React.useEffect(() => {
  //   if (ref.current) {
  //     setWidth(ref.current.offsetWidth * 0.99); // needs 0.99 so it doesn't fix the outer container width.
  //   }
  // }, [ref]);
  React.useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth * 0.99); // needs 0.99 so it doesn't fix the outer container width.
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth * 0.99);
      }
    });
  }, [ref]);

  return (
    <div className="w-full" ref={ref}>
      <div className="">
        <BarChart
          width={width ? width : 500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 20, right: 20 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="views" fill="#8884d8" background={{ fill: "#eee" }} />
        </BarChart>
      </div>
    </div>
  );
}
