import React, { useEffect, useState } from "react";
import { readList } from "../utility/crudUtility";
import ListCard from '../components/ListCard'

const Lists = () => {
  const [lists, setLists] = useState([]);
  let TempSolution = 0;
  const selCateg = [];

  useEffect(() => {
    const unsubscribe = readList(setLists, selCateg);
    return () => unsubscribe();
  }, [TempSolution]);

  console.log(lists);
  return (
    <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-8  pb-6">
      {lists.map((list) => (
        <div key={list.id}>
          <ListCard description={list.desc} title={list.title} likes={list.likes} categories={list.categories} url={list.games[0].background_image} id={list.id}/>
        </div>
      ))}
    </div>
  )
};

export default Lists;
