import React, { useEffect, useState } from "react";
import { readList } from "../utility/crudUtility";
import ListCard from "../components/ListCard";
import { getTags } from "../utility/rawgAPI";

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [selCateg, setSelCateg] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    getTags(setTags);
  }, []);

  useEffect(() => {
    const unsubscribe = readList(setLists, selCateg);
    return () => unsubscribe();
  }, [selCateg]);

  const handleCategoryChange = (category) => {
    setSelCateg((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) 
        : [...prev, category] 
    );
  };

  return (
    <div className="mt-32 mx-8 pb-6">
      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Categories:
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 border rounded-md bg-white flex justify-between items-center"
        >
          {selCateg.length > 0 ? selCateg.join(", ") : "Select categories"}
          <span className="ml-2">&#9662;</span>
        </button>

       
        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
            {tags.map((category) => (
              <div
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`p-2 cursor-pointer hover:bg-rose-600 hover:text-slate-100 ${
                  selCateg.includes(category) ? "bg-rose-600 text-slate-100" : ""
                }`}
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lists Grid */}
      {!lists.length && <p className="text-rose-600 text-center text-xl font-semibold">No list available of the selected category!</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {lists.map((list) => (
          <div key={list.id}>
            <ListCard
              description={list.desc}
              title={list.title}
              likes={list.likes}
              categories={list.categories}
              url={list.games[0].background_image}
              id={list.id}
              username={list?.username}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lists;
