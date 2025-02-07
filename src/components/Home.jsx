import React, { useEffect, useState } from 'react';
import Event from './Event';
import ListCard from './ListCard';
import { readList } from '../utility/crudUtility';

const Home = () => {
    const [lists, setLists] = useState([]);
    let TempSolution = 0;
    const selCateg = ["Shooter", "Indie"];
  
    useEffect(() => {
      const unsubscribe = readList(setLists, selCateg);
      return () => unsubscribe();
    }, [TempSolution]);
  
  return (
    <>
      <Event />
      <h2 className='text-center text-slate-800 font-semibold text-xl font-mono mt-8'>Top rated lists</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-8 mt-8 pb-6'>
      {lists.slice(0, 3).map((list) => (
        <div key={list.id}>
          <ListCard 
            description={list.desc} 
            title={list.title} 
            likes={list.likes} 
            categories={list.categories} 
            url={list.games[0].background_image} 
            id={list.id}
          />
        </div>
      ))}
      </div>
    </>
  );
}

export default Home;