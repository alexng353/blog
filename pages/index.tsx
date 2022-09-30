import { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function Home() {
  const [name, setName] = useState("");
  return (
    <div className="p-5 min-h-screen text-black">
      <div>
        <TextField
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Name"
          variant="standard"
          size="small"
        />
        <button className="">Submit</button>
      </div>
    </div>
  );
}
