/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import Image from "next/image";

// import dynamic from "next/dynamic";
// const Text = dynamic(() => import("./components/text"), {
//   ssr: false,
// });
import Text from "./components/text";
import Header from "./components/header";
import VideoEmbed from "./components/video";

export interface Field {
  type: string;
  name?: string;
  content?: string;
  src?: string;
  justify?: boolean;
  indent?: boolean;
  centered?: boolean;
}

export interface RenderProps {
  fields: Field[];
}

function RenderComponent({
  type,
  name,
  content,
  src,
  justify = true,
  indent = true,
  centered = false,
}: Field) {
  switch (type) {
    case "text":
      if (!content) {
        return null;
      }
      return (
        <Text content={content} justify={justify} indent={indent} key={name} />
      );

    case "image":
      if (centered) {
        return (
          <div className="grid place-items-center">
            {src && <img src={src} alt={name} />}
          </div>
        );
      }
      return <>{src && <img src={src} alt={name} className="my-4" />}</>;

    case "title":
      return (
        <h1 className="text-2xl" id={name}>
          {content}
        </h1>
      );

    case "author":
      return <p className="text-gray-600 text-sm">{content}</p>;

    case "subtitle":
      return <h2 className="text-xl text-gray-500">{content}</h2>;

    case "banner":
      return (
        <div className="flex items-center h-60 w-full overflow-hidden">
          {src && <img src={src} alt={name} />}
        </div>
      );

    case "video":
      if (!src) {
        return null;
      }
      return <VideoEmbed src={src} />;

    case "header":
      return <Header name={name} content={content} />;
    default:
      return null;
  }
}

/**
 *
 * @param data data.fields must be a JavaScript Object of type RenderProps, NOT a stringified JavaScript Object
 * @returns Rendered page
 */

export default function Render(data: RenderProps) {
  // if there is a banner, render it first
  const banner = data.fields.find((field) => field.type === "banner");
  if (banner) {
    data.fields.splice(data.fields.indexOf(banner), 1);
    data.fields.unshift(banner);
  }
  return (
    <div className="">
      {data.fields.map((field, index) => (
        <div key={index}>
          <RenderComponent
            key={index}
            type={field.type}
            name={field.name}
            content={field.content}
            src={field.src}
            justify={field.justify}
            indent={field.indent}
            centered={field.centered}
          />
        </div>
      ))}
    </div>
  );
}
