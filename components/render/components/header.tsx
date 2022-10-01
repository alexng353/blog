import { BsLink45Deg } from "react-icons/bs";

export interface HeaderProps {
  name?: string;
  content?: string;
}

export default function Header ({ name, content }: HeaderProps) {
  return (
    <div className="inline-flex">
    <h1 className="text-2xl" id={name}>
      {content}
    </h1>
    &nbsp;
    <button
      // onclick, copy to clipboard
      onClick={() => {
        name && navigator.clipboard.writeText(window.location.href + "#" + name);
      }}
    >
      <BsLink45Deg className="h-6 w-6" />
    </button>
  </div>
  )
}