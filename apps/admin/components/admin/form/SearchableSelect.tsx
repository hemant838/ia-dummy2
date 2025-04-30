'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function SearchableSelect({
  data = [],
  placeholder = 'Search...',
  onSelectChange = () => null,
  className = ''
}: any) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const filteredItems = data.filter((item: any) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`absolute text-xs z-50 left-0 top-full w-full min-w-[180px] bg-white shadow-lg border border-gray-100 rounded-lg overflow-hidden mt-1 ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to allow click
        className="w-full border-b border-b-gray-200 p-2 rounded-t outline-none"
      />
      <ul className="w-full h-auto max-h-40 space-y-1 p-1 overflow-y-auto">
        {filteredItems?.map((item: any, index: number) => (
          <li
            key={index}
            onClick={() => {
              setIsFocused(false);
              onSelectChange(item);
            }}
            className="w-full px-2 py-2 cursor-pointer rounded-[6px] hover:bg-gray-50"
          >
            <span
              className={`${item.color?.bg || ''} ${item.color?.border || ''} border rounded-[6px] px-2 py-1`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableSelect;
