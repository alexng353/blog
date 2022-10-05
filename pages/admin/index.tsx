import NavBar from "components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "components/loading";

export default function AdminPage() {
  // login
  const [admin, setAdmin] = useState(false);
  const [enableredir, setEnableredir] = useState(false);
  const [user, setUser] = useState(null as any);
  const [data, setData] = useState(null as any);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("basic") !== null) {
      // login
      fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("basic")!,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const tmp = data;
          delete tmp.message;
          setUser(tmp);
          if (data.admin === true) {
            setAdmin(true);
          } else {
            window.location.href = `/login?redirect=${encodeURIComponent(
              "/admin"
            )}`;
          }
        });
    }
    setEnableredir(true);
  }, []);
  useEffect(() => {
    if (admin) {
      fetch("/api/posts?n=1000&content=false")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          console.log(data);
        });
    }
  }, [admin]);

  if (admin) {
    return (
      <>
        <NavBar />
        <div>
          <h1>Admin Page</h1>
          <p>
            Logged in as {user.name}: <span>{user.email}</span>
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <Spinner />
    </>
  );
}
