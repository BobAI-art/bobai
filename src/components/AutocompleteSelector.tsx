import React from "react";

export const AutocompleteSelector: React.FC<{
  onSelect: (prompt: string) => void;
  autocomplete: { photoUrl: string; content: string }[];
}> = ({ onSelect, autocomplete }) => {
  return (
    <ul className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-3 lg:grid-cols-6">
      {autocomplete.map((item) => (
        <li
          className={`flex aspect-square cursor-pointer items-end overflow-hidden rounded border border-black bg-cover bg-center bg-no-repeat shadow`}
          style={{
            backgroundImage: `url(${item.photoUrl})`,
          }}
          key={item.content}
          onClick={() => onSelect(item.content)}
        >
          <div className="w-full	p-2 text-gray-100 drop-shadow  backdrop-blur backdrop-brightness-50">
            {item.content}
          </div>
        </li>
      ))}
    </ul>
  );
};
