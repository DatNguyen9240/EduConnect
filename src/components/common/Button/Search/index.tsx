import React, { useState, useEffect } from "react";

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = "Tìm kiếm...",
}) => {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(keyword.trim());
    }, 300); // debounce 300ms
    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <div className="mb-4 w-full sm:w-80">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
