import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ListCard from "../components/ListCard";
import { getTags } from "../utility/rawgAPI";
import { fetchLists, generateSchema } from "../utility/crudUtility";

const Lists = () => {
  const [selCateg, setSelCateg] = useState([]);
  const [categoriesSelectionIsOpen, setCategoriesSelectionIsOpen] = useState(false);

  generateSchema("Lists")

  const {data: tags, isLoading: loadingTags, isError: errorTags, error} = useQuery({
    queryKey: ['tag'],
    queryFn: () => getTags()
  })
  
  const {
    data: lists,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["topLists", selCateg], 
    queryFn: ({ pageParam = null }) => fetchLists(5, selCateg, pageParam), 
    
    getNextPageParam: (lastPage) => {
      if (!lastPage?.lastDoc) return undefined;
      return lastPage.lastDoc;
    },

    initialData: {
      pages: [],
      pageParams: [],
    },
    
    onError: (error) => {
      console.error("Error fetching lists:", error);
    },
    
  });

  // Handle scroll event for lazy loading
  const handleScroll = useCallback(() => {
    if (isFetching || !hasNextPage) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage]);
  
  useEffect(() => {
    window.scrollTo(window.top);
  }, []);

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

      {isLoading && <p className="text-center text-gray-600">Loading...</p>}
      {isError && <p className="text-center text-rose-600">Error loading lists!</p>}
      {!lists?.pages?.length && <p className="text-rose-600 text-center text-xl font-semibold">No list available for the selected category!</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {lists?.pages?.map((page) =>
          page?.docs?.map((list) => (
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
          ))
        )}
      </div>

      {isFetching && <p className="text-center text-gray-600">Loading more...</p>}
    </div>
  );
};

export default Lists;
