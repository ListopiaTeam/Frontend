import React, {useState, useEffect} from 'react'
import TemplateList from '../components/TemplateList'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import SearchBox from '../components/SearchBox';

const CreateList = () => {
  const [open, setOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([])

  console.log(selectedGames);
  
  
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
          <SearchBox setGames={setGames} games={games} setSelectedGames={setSelectedGames}/>
        </div>
        <div className='flex flex-col gap-5 mt-10 '>
          {selectedGames.map((game) => {
            return(
              <p>{game.name}</p>
            )
          })}

        </div>
      </Modal>
    </form>
  )
}

export default CreateList