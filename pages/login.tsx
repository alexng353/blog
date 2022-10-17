import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Test() {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  // grab ?redirect
  // const redirect = router.query.redirect ? router.query.redirect[0] : "/";
  const redirect = router.query.redirect;
  return (
    <div className="w-full min-h-screen grid place-items-center bg-">
      <div className="flex flex-col w-96 gap-4 m-4 shadow-md rounded-xl p-4 bg-gray-200">
        <input
          type="text"
          className="shadow-md rounded-xl p-2 outline-none"
          placeholder="Email"
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
        <div className="inline-flex shadow-md rounded-lg bg-white relative">
          <input
            type={showPass ? "text" : "password"}
            className="flex-1 p-2 rounded-lg outline-none"
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

        {/* change to input password type */}
        <button
          className="hover:bg-gray-50 shadow-md rounded-lg p-2 bg-white"
          onClick={() => {
            const basic = Buffer.from(`${password}:${user}`).toString("base64");
            fetch("/api/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: basic,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  alert(data.error);
                } else {
                  localStorage.setItem("basic", basic);
                  router.push(redirect as string);
                }
              });

            // if (redirect) {
            //   router.push(redirect as string);
            // }
          }}
        >
          Login
        </button>
        <div className="w-full flex justify-center">
          <Link
            className="text-blue-600 hover:underline hover:text-blue-800 text-sm"
            href="/signup"
          >
            <a>Don&apos;t have an account? Sign up</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
