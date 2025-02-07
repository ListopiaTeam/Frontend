import React, { useEffect, useState } from "react";
import { readList } from "../utility/crudUtility";

const Lists = () => {
  const [lists, setLists] = useState([]);
  let TempSolution = 0;
  const selCateg = ["Shooter", "Openworld"];

  useEffect(() => {
    const unsubscribe = readList(setLists, selCateg);
    return () => unsubscribe();
  }, [TempSolution]);

  console.log(lists);
  return <div className="mt-32">Lists</div>;
};

export default Lists;
