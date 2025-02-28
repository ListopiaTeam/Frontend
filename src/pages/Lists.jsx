import React, { useEffect, useCallback, useContext, useState } from "react";
import { fetchLists } from "../utility/crudUtility";
import ListCard from "../components/ListCard";
import { getTags } from "../utility/rawgAPI";
import { LastDocContext } from "../context/LastDocContext";

const Lists = () => {
  const [tags, setTags] = useState([]);
  const [selCateg, setSelCateg] = useState([]);
  const [categoriesSelectionIsOpen, setCategoriesSelectionIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { lastDoc, setLastDoc, lists, setLists } = useContext(LastDocContext);

  useEffect(() => {
    setLists([]);
    setLastDoc(null); 
    fetchLists(5, selCateg, [], setLists, null, setLastDoc); 
  }, [selCateg]);
  
  useEffect(() => {
    getTags(setTags);
  }, []); 
  

  const handleScroll = useCallback(async () => {
    if (isFetching) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      setIsFetching(true);
      await fetchLists(5, selCateg, lists, setLists, lastDoc, setLastDoc);
      setIsFetching(false);
    }
  }, [isFetching, selCateg, lastDoc, lists]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleCategoryChange = (category) => {
    setSelCateg((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="mt-32 mx-8 pb-6">
      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Categories:</label>
        <button
          onClick={() => setCategoriesSelectionIsOpen(!categoriesSelectionIsOpen)}
          className="w-full p-2 border rounded-md bg-white flex justify-between items-center"
        >
          {selCateg.length > 0 ? selCateg.join(", ") : "Select categories"}
          <span className="ml-2">&#9662;</span>
        </button>

        {categoriesSelectionIsOpen && (
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

      {!lists.length && <p className="text-rose-600 text-center text-xl font-semibold">No list available for the selected category!</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {lists?.map((list) => (
          <div key={list.id}>
            <ListCard
              description={list.desc}
              title={list.title}
              likes={list.likes}
              categories={list.categories}
              url={list.games[0]?.background_image}
              id={list.id}
              username={list?.username}
            />
          </div>
        ))}
      </div>

      {isFetching && <p className="text-center text-gray-600">Loading more...</p>}
    </div>
  );
};

export default Lists;
