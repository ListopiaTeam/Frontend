import React, {useState, useEffect} from 'react'
import TemplateList from '../components/TemplateList'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import SearchBox from '../components/SearchBox';
import { searchGamesByName } from '../utility/rawgAPI'

const CreateList = () => {
  const [open, setOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([])
  const [searchedGame, setSearchedGame] = useState("");
  
  const searchGame = () => {
    searchGamesByName(setGames, searchedGame)
  }
  
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const modalStyles = {
    modal: {
      height: '700px',
      maxHeight: '80vh', 
      overflow: 'auto', 
    },
  };

  return (
    <form onSubmit={(e)=>e.preventDefault()} className='flex flex-col items-center justify-center mt-24 mb-6'>
      <TemplateList/>
      <div className="flex flex-col gap-3 mt-5">
        <button onClick={onOpenModal} className="block rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto">Add games</button>
        <button className="block rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto">Submit List</button>
      </div>
        <Modal open={open} onClose={onCloseModal} styles={modalStyles}>
        <h2 className='font-bold text-xl'>Search Games</h2>
        <div className='mt-8 sm:w-96 w-52'>
        <div className="flex items-center gap-2 bg-white border rounded-md p-2 shadow-sm">
        <input
          type="text"
          className="border-none outline-none flex-1 p-2 text-gray-700"
          placeholder="Search Games"
          value={searchedGame}
          onChange={(e) => setSearchedGame(e.target.value)}
        />
        <button
          onClick={searchGame}
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
        >
          Search
        </button>
      </div>
      {/* Display Selected Games */}
      {selectedGames.length > 0 && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Selected Games:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {selectedGames.map((game) => (
                <li key={game.id}>{game.name}</li>
              ))}
            </ul>
          </div>
        )}
          {/* <SearchBox setGames={setGames} games={games} setSelectedGames={setSelectedGames}/> */}
        </div>

        {/* Display games */}
        <div className="flex flex-col gap-5 mt-8">
        {games.length > 0 ? (
          games.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-md"
            >
              <img
                src={item.background_image}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md"
                alt={item.name}
              />
              <span className="text-base sm:text-lg font-semibold text-gray-800 text-center sm:text-left">
                {item.name}
              </span>
              <button
                onClick={() => {
                  setSelectedGames((prevSelected) =>
                    prevSelected.some((game) => game.id === item.id)
                      ? prevSelected.filter((game) => game.id !== item.id) 
                      : [...prevSelected, item] 
                  );
                }}
                className={`sm:ml-auto px-3 py-2 rounded-md transition 
                  ${selectedGames.some((game) => game.id === item.id) 
                    ? "bg-black text-white" 
                    : "bg-rose-600 hover:bg-rose-700 text-white"}
                `}
              >
                {selectedGames.some((game) => game.id === item.id) ? "Remove game" : "Add Game"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No games found.</p>
        )}
      </div> 
        
      </Modal>
    </form>
  )
}

export default CreateList