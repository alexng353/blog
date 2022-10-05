import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-64 rounded-full h-full bg-gray-600 flex items-center">
      <input
        type="text"
        className="bg-gray-600 w-full h-full px-4 rounded-full outline-none"
        placeholder="Search..."
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
}
