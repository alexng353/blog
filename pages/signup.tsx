import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="w-full min-h-screen grid place-items-center bg-">
      <div className="flex flex-col w-96 gap-4 m-4 shadow-md rounded-xl p-4 bg-gray-200">
        <input
          type="text"
          className="shadow-md rounded-xl p-2 outline-none"
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          className="shadow-md rounded-xl p-2 outline-none"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="inline-flex shadow-md rounded-xl bg-white relative">
          <input
            type={showPass ? "text" : "password"}
            className="flex-1 p-2 rounded-xl outline-none"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {/* toggle button with checkmark */}
          <div className="absolute right-0 flex items-center h-full p-4">
            {password.length < 24 && (
              <p className="pr-2 text-gray-300 select-none">
                Show Password &rarr;
              </p>
            )}
            <input
              className=""
              type="checkbox"
              onClick={() => {
                setShowPass(!showPass);
              }}
            />
          </div>
        </div>
        <button
          className="hover:bg-blue-50 shadow-md rounded-xl p-2 bg-white"
          onClick={() => {
            fetch("/api/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  name,
                  email,
                  password,
                },
              }),
            }).then((res) => {
              res.json().then((data) => console.log(data));
            });
          }}
        >
          Sign Up
        </button>
        <div className="w-full flex justify-center">
          <Link
            href="/login"
            className="text-blue-600 hover:underline hover:text-blue-800 text-sm"
          >
            <a>Have an account? Log in</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
