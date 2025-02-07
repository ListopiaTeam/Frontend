import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readLists } from '../utility/crudUtility';

const Details = () => {
    const { id } = useParams();
    const [list, setList] = useState(null);

    useEffect(() => {
        readLists(id, setList);
    }, [id]);

    if (!list) {
        return <div>Loading...</div>;
    }
    console.log(list);
    

    return (
        <div className="min-h-screen mt-32">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
                <p className="text-gray-700 mt-2">{list.desc}</p>
                
                <h2 className="text-xl font-semibold mt-4">Categories</h2>
                <div className="flex gap-2 mt-2">
                    {list.categories.map((category, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 bg-rose-100 px-3 py-1.5 text-xs font-mono font-medium cursor-pointer select-none hover:bg-rose-200 rounded"
                            
                            >
                            {category}
            </span>
                    ))}
                </div>

                <h2 className="text-xl font-semibold mt-4">Games</h2>
                <div className="mt-2">
                    {list.games.map((game) => (
                        <div key={game.id} className="p-4 bg-gray-50 rounded-lg shadow-md flex items-center gap-4 mt-3">
                            <img src={game.background_image} alt={game.name} className="w-20 h-20 rounded-md" />
                            <div>
                                <h3 className="text-lg font-semibold">{game.name}</h3>
                                <p className="text-gray-600">Released: {game.released}</p>
                                <p className="text-gray-600">Rating: {game.rating} / 5</p>
                                <p className="text-gray-600">Available at: {game.stores.map(store => store.name).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Details;