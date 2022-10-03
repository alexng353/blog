import { Field } from "components/render/render";
import Render from "components/render";
import { Key, useEffect, useState } from "react";

import styles from "styles/editor.module.css";

import defaultData from "data/default_editor.json";
import { TextareaAutosize } from "@mui/material";

type KeyJoined = Key | null | undefined;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function FieldEditor(props: {
  field: Field;
  index: KeyJoined;
  onChange: (e: any) => void;
  onDelete: () => void;
  onInsertAbove: (e: any) => void;
  onInsertBelow: (e: any) => void;
}) {
  const field = props.field;
  // if banner, image or video, use src
  let placeholder;
  if (field.type === "banner" || field.type === "image") {
    placeholder = `${field.type} URL`;
  } else if (field.type === "video") {
    placeholder = "Video URL (YouTube)";
  } else if (
    field.type === "author" ||
    field.type === "title" ||
    field.type === "header"
  ) {
    placeholder = `${capitalize(field.type)}`;
  } else {
    placeholder = "Content";
  }

  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={styles.editblock}
      onMouseOver={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="relative">
        <h1 className={styles.title}>{capitalize(field.type)}</h1>

        <div className="absolute right-0 top-0 min-w-full h-full">
          {showOptions && (
            <div className="absolute right-0 top-0 flex gap-4">
              <DropDown
                callback={(e) => {
                  props.onInsertBelow(e);
                }}
                type="insert (below)"
              />
              <DropDown
                callback={(e) => {
                  props.onInsertAbove(e);
                }}
              />
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-all"
                onClick={props.onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.inputwrapper}>
        {field.type !== "text" ? (
          <input
            type="text"
            className={styles.input}
            defaultValue={field.src ? field.src : field.content}
            placeholder={placeholder}
            onChange={(e) => {
              // change field src and run props.onchange with it
              // field.src = e.target.value;
              // if type is banner, image or video, use src
              if (
                field.type === "banner" ||
                field.type === "image" ||
                field.type === "video"
              ) {
                field.src = e.target.value;
              } else {
                field.content = e.target.value;
              }
              props.onChange(field);
            }}
          />
        ) : (
          <TextareaAutosize
            className={styles.textarea}
            defaultValue={field.content}
            onChange={(e) => {
              field.content = e.target.value;
              props.onChange(field);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function Editor() {
  const [data, setData] = useState<string>(JSON.stringify(defaultData));
  // function to generate json file from data and download
  function downloadJSON() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(JSON.parse(data), null, 2)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = new Date().toString() + ".json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  // save to localstorage
  useEffect(() => {
    if (data !== JSON.stringify(defaultData)) {
      localStorage.setItem("editor_data", data);
    }
  }, [data]);

  // onstartup, grab data from localstorage
  useEffect(() => {
    const localData = localStorage.getItem("editor_data");
    if (localData) {
      setData(localData);
    }
  }, []);

  function resetData() {
    setData(JSON.stringify(defaultData));
  }

  // grab "basic" from localstorage and fetch
  function postData() {
    const authorization = localStorage.getItem("basic");
    if (!authorization) {
      alert("You are not logged in!");
      return;
    }
    // loop over the data and find the first title
    const parsedData = JSON.parse(data);
    let title = "";
    for (let i = 0; i < parsedData.length; i++) {
      if (parsedData[i].type === "title") {
        title = parsedData[i].content;
        break;
      }
    }
    if (title === "") {
      alert("You need to have a title!");
      return;
    }

    const tmp = {
      title: title,
      content: data,
    };

    fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authorization,
      },
      body: JSON.stringify(tmp),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  return (
    <>
      <div className="min-h-screen w-full grid grid-cols-2 pl-4 pt-4 gap-4 pr-2 bg-gray-800 text-white cursor-white">
        <div className="relative">
          <div className="h-8 flex gap-4">
            <button
              className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-all"
              onClick={downloadJSON}
            >
              Download JSON
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-all"
              onClick={resetData}
            >
              Reset to Default
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-all"
              onClick={postData}
            >
              Post Data
            </button>
          </div>
          <div className="top-0 right-0 h-8 absolute">
            <a href="/tutorial" target="_blank">
              <button className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-all">
                Tutorial
              </button>
            </a>
          </div>

          {JSON.parse(data).length > 0 ? (
            JSON.parse(data).map((field: Field, index: any) => {
              // return <Render key={index} fields={[field]} />;
              return (
                <div className="mt-4">
                  <FieldEditor
                    field={field}
                    index={index}
                    onChange={(e) => {
                      const tmp = JSON.parse(data);
                      tmp[index] = e;
                      setData(JSON.stringify(tmp));
                      // console.log(index);
                    }}
                    onDelete={() => {
                      const tmp = JSON.parse(data);
                      // remove the element at index
                      tmp.splice(index, 1);
                      setData(JSON.stringify(tmp));
                    }}
                    onInsertAbove={(e) => {
                      const tmp = JSON.parse(data);
                      // insert a new element at index
                      console.log(e);
                      tmp.splice(index, 0, e);
                      setData(JSON.stringify(tmp));
                    }}
                    onInsertBelow={(e) => {
                      const tmp = JSON.parse(data);
                      // insert a new element at index
                      console.log(e);
                      tmp.splice(index + 1, 0, e);
                      setData(JSON.stringify(tmp));
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="ml-96">
              <DropDown
                callback={(e) => {
                  setData(JSON.stringify([e]));
                }}
                type="insert"
                position="left"
              />
            </div>
          )}
        </div>
        {/* <div className="overflow-scroll break-words">
        <pre>{data && JSON.stringify(JSON.parse(data), null, 2)}</pre>
      </div> */}
        <div>{data && <Render fields={JSON.parse(data)} />}</div>
      </div>
      <pre className="text-white">
        <h1 className="text-2xl text-center">OUTPUT</h1>
        <Markdown source={JSON.stringify(JSON.parse(data), null, 2)} />
      </pre>
      <div className="min-h-[25vh] bg-gray-800"></div>
    </>
  );
}
import React from "react";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import remarkToc from "remark-toc";

import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import mdstyles from "styles/md.module.css";

// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface MarkdownProps {
  source: string;
}

function Markdown({ source }: MarkdownProps) {
  // add ``` to both sides of source
  source = "```json\n" + source + "\n```";
  return (
    <ReactMarkdown
      className={mdstyles.markdown_body}
      remarkPlugins={[remarkSlug, remarkToc, remarkGfm]}
      // rehypePlugins={[rehypeHighlight, rehypeRaw]}
      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw]}
    >
      {source}
    </ReactMarkdown>
  );
}

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function DropDown(props: {
  callback?: (e: any) => void;
  type?: string;
  position?: string;
}) {
  const types = [
    {
      type: "banner",
      src: "/BHPUd0d.jpg",
    },
    {
      type: "title",
      content: "Making sure this works",
      name: "title",
    },
    {
      type: "author",
      content: "John Doe",
    },
    {
      type: "image",
      src: "https://picsum.photos/200/300",
    },
    {
      type: "video",
      src: "https://youtube.com/embed/PXqcHi2fkXI",
    },
    {
      type: "text",
      indent: false,
      content:
        "*italic*\n**bold**\n__underline__\n`code`\n__***underlined bold italics***__\n[link](https://google.com)\n\ncode blocks do not mix well with other render options!\n\n",
    },
  ];
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-green-600 text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {props.type ? props.type : "Insert (above)"}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/* edit the below className (left-0, right-0) to change which way the menu pops out */}
        <Menu.Items
          className={`origin-top-right absolute ${
            props.position ? props.position : "right"
          }-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]`}
        >
          <div className="py-1">
            {types.map((type, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={() => {
                      props.callback && props.callback(type);
                    }}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full text-left px-4 py-2 text-sm"
                    )}
                  >
                    {type.type}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
