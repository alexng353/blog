import { useState } from "react";
import Render, { Field } from "components/render/render";
import TextareaAutosize from "react-textarea-autosize";

import defaultData from "data/default_editor.json";
// import Render from "@/components/render";

export default function Editor() {
  const [data, setData] = useState<Field[]>(
    JSON.parse(JSON.stringify(defaultData))
  );
  const [tmp, setTmp] = useState(data);
  function Checker() {
    try {
      JSON.parse(JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  }

  function TextBoxMaker(props: { field: Field; index: any }) {
    const field = JSON.parse(JSON.stringify(props.field));
    // const field = props.field;
    return (
      <div>
        <label>{field.type}</label>
        <br />
        <TextareaAutosize
          defaultValue={field.content ? field.content : field.src}
          className="w-full bg-black cursor-auto p-2"
          onChange={(e) => {
            field.content
              ? (field.content = e.target.value)
              : (field.src = e.target.value);
            setData((prev) => {
              prev[props.index] = field;
              return prev;
            });
          }}
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full grid grid-cols-2 pl-4 pt-4 bg-gray-800 text-white cursor-white">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <button
            className="bg-gray-700 p-2 rounded-md"
            onClick={() => {
              setData(tmp);
            }}
          >
            Click Me
          </button>
        </div>
        {data.map((field: Field, index) => {
          return (
            <div key={index}>
              <TextBoxMaker field={field} index={index} />
            </div>
          );
        })}
      </div>
      <div className="px-4">
        {Checker() ? (
          <Render fields={data} />
        ) : (
          <div className="text-red-500">Invalid JSON</div>
        )}
      </div>
    </div>
  );
}
