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

  function TextBoxMaker(props: { field: Field; index: any }) {
    const field = props.field;
    return (
      <div>
        <label>{field.type}</label>
        <br />
        <TextareaAutosize
          defaultValue={field.content}
          className="w-full bg-black"
          onChange={(e) => {
            // setData((prev) => {
            //   prev[props.index].content = e.target.value;
            //   return [...prev];
            // });
            setTmp((prev) => {
              prev[props.index].content = e.target.value;
              return [...prev];
            });
          }}
        />
        {/* <textarea
          name="text"
          // onInput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
          style={{ height: "auto" }}
          className={`w-full bg-black text-white`}
          value={field.content ? field.content : field.src}
        ></textarea> */}
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full grid grid-cols-2 p-4 bg-gray-800 text-white">
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
      <div>
        <Render fields={data} />
      </div>
    </div>
  );
}
