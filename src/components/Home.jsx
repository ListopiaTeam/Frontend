import React from 'react';
import Event from './Event';
import ListCard from './ListCard';

const Home = () => {
  return (
    <>
      <Event />
      <h2 className='text-center text-slate-100 text-xl font-mono mt-8'>Top rated lists</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 m-8'>

        {Array(3).fill(null).map((_, index) => (
          <ListCard key={index} />
        ))}
      </div>
    </>
  );
}

export default Home;
