import React, { useEffect } from "react";
import styles from "./Text.module.css";

export interface TextProps {
  content: string;
  justify?: boolean;
  indent?: boolean;
}

export default function Text({
  content,
  justify = true,
  indent = true,
}: TextProps) {
  const [text, setText] = React.useState<string>(content);
  useEffect(() => {
    const code_regex = /`(.*?)`/g;
    const code_replaced = content.replace(code_regex, (match, p1) => {
      const code = document.createElement("code");
      code.classList.add(styles.code);
      code.innerHTML = p1;
      return code.outerHTML;
    });

    // search for __underline__ and replace it with a underline tag
    const underline_regex = /__(.*?)__/g;

    const underline_replaced = code_replaced.replace(
      underline_regex,
      (match, p1) => {
        const underline = document.createElement("span");
        underline.classList.add(styles.underline);
        underline.innerHTML = p1;
        return underline.outerHTML;
      }
    );

    // search for ***bold italic*** and replace it with a bold italic text
    const bold_italic_regex = /\*\*\*(.*?)\*\*\*/g;
    const bold_italic_replaced = underline_replaced.replace(
      bold_italic_regex,
      (match, p1) => {
        const bold_italic = document.createElement("span");
        bold_italic.classList.add(styles.bold_italic);
        bold_italic.innerHTML = p1;
        return bold_italic.outerHTML;
      }
    );

    // searches for **bold** and replaces it with a bold tag
    const bold_regex = /\*\*(.*?)\*\*/g;
    const bold_replaced = bold_italic_replaced.replace(
      bold_regex,
      (match, p1) => {
        const bold = document.createElement("span");
        bold.classList.add(styles.bold);
        bold.innerHTML = p1;
        return bold.outerHTML;
      }
    );

    // search for *italic*
    const italic_regex = /\*(.*?)\*/g;
    const italic_replaced = bold_replaced.replace(italic_regex, (match, p1) => {
      const italic = document.createElement("i");
      italic.classList.add(styles.italic);
      italic.innerHTML = p1;
      return italic.outerHTML;
    });
    const test = {
      type: "text",
      content: "**bold**\n*italic*\n***bold italic***",
    };

    const link_regex = /\[(.*?)\]\((.*?)\)/g;
    const link_replaced = italic_replaced.replace(
      link_regex,
      (match, p1, p2) => {
        const link = document.createElement("a");
        link.classList.add(styles.link);
        link.href = p2;
        link.innerHTML = p1;
        return link.outerHTML;
      }
    );
    setText(link_replaced);
  }, [content]);
  return (
    <p
      className={styles.text}
      style={{
        textAlign: justify ? "justify" : "left",
        textIndent: indent ? "30px" : "0px",
        whiteSpace: "pre-line",
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
