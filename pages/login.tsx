import { useState } from "react";

export default function Test() {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  return (
    <div className="flex flex-col w-96 gap-4 m-4">
      <input
        type="text"
        placeholder="username"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      <button
        onClick={() => {
          const basic = Buffer.from(`${user}:${password}`).toString("base64");
          fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: basic,
            },
          }).then((res) => {
            res.json().then((data) => console.log(data));
          });
          localStorage.setItem("basic", basic);
          // fetch("/api/test", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //     authorization: basic,
          //   },
          // }).then((res) => {
          //   res.json().then((data) => console.log(data));
          // });
        }}
      >
        login
      </button>
    </div>
  );
}
