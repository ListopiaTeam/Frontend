import React, { useContext, useEffect, useState } from 'react'
import TemplateList from '../components/TemplateList'
import 'react-responsive-modal/styles.css';
import { UserContext } from "../UserContext";
import { Modal } from 'react-responsive-modal';
import { getTags, searchGamesByName } from '../utility/rawgAPI'
import { addList } from "../utility/crudUtility";
import Alert from "../components/Alert";

const CreateList = () => {
  const {user} = useContext(UserContext)
  const [open, setOpen] = useState(false);

  const [games, setGames] = useState([]);
  const [tags, setTags] = useState([])

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedGames, setSelectedGames] = useState([])
  const [searchedGame, setSearchedGame] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  const searchGame = () => {
    searchGamesByName(setGames, searchedGame)
  }

  useEffect(() => {
    getTags(setTags)
  }, [])

  const addNewTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      setErr("You must be logged in to create a list!")
      setTimeout(() => {
        setErr("")
      }, 4000)
      return;
    }

    if(!(e.target[0].value && e.target[1].value && selectedGames.length>0)){
      setErr("Give all details to create a list!")
      setTimeout(() => {
        setErr("")
      }, 4000)
      return;
     }
    
    const formData = {
      title: e.target[0].value,
      desc: e.target[1].value,
      categories:  selectedTags.map((tags) => tags),
      games: selectedGames.map((game) => game),
      likes: 0,
      userID: user.uid,
    };

    try {
       {
        await addList(formData);
        setMsg("List successfully created!");
        setTimeout(() => {
          setMsg("")
        }, 4000)
        setSelectedGames([]);
       }
    } catch (error) {
      console.error("Error creating list:", error);
      setErr("Failed to create the list. Please try again.");
      setTimeout(() => {
        setErr("")
      }, 4000)
    }
  }

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const modalStyles = {
    modal: {
      maxWidth: '640px',
      width: '90%',
      padding: '0',
      borderRadius: '12px'
    },
    closeButton: {
      top: '1.5rem',
      right: '1.5rem'
    }
  };

  const tagModalStyles = {
    modal: {
      maxWidth: '500px',
      width: '90%',
      padding: '0',
      borderRadius: '12px'
    },
    closeButton: {
      top: '1.5rem',
      right: '1.5rem'
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center mt-24 mb-6'>

      <TemplateList
        src={selectedGames && selectedGames[0]?.background_image}
        selectedTags={selectedTags}
        onTagRemove={removeTag}
        onTagModalOpen={() => setIsTagModalOpen(true)}
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <button
          type='button'
          onClick={onOpenModal}
          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-colors"
        >
          <span className="text-lg">+</span>
          Add Games
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors"
        >
          Publish List
        </button>
      </div>

      {/* Tag selection modal */}

   
        <Modal
          open={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          styles={tagModalStyles}
          classNames={{ modal: '!rounded-xl' }}
        >
          <div className="p-6 pb-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className='text-2xl font-bold text-gray-900'>Manage Tags</h2>
            </div>

            <div className="mt-6">
            

              {tags.length > 0 && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags
                      .filter(tag => 
                        tag.toLowerCase().includes(newTag.trim().toLowerCase())
                      )
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!selectedTags.includes(tag)) {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-rose-600 text-white hover:bg-rose-700'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {selectedTags.length > 0 && (
                <div className="mt-6 p-4 border border-rose-200 rounded-lg bg-rose-50">
                  <h3 className="font-semibold text-gray-900 mb-3">Selected Tags ({selectedTags.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-200 rounded-full text-sm text-rose-700"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-rose-400 hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>

      {/* Game selection modal */}

      <Modal
        open={open}
        onClose={onCloseModal}
        styles={modalStyles}
        classNames={{ modal: '!rounded-xl' }}
      >
        <div className="p-6 pb-8">
          <div className="border-b border-gray-200 pb-4">
            <h2 className='text-2xl font-bold text-gray-900'>Add Games to List</h2>
          </div>

          <div className='mt-6'>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 shadow-sm focus-within:border-rose-600 focus-within:ring-1 focus-within:ring-rose-600">
              <span className="text-gray-400 ml-2">🔍</span>
              <input
                type="text"
                className="w-full border-none outline-none p-2 text-gray-900 placeholder-gray-400"
                placeholder="Search games..."
                value={searchedGame}
                onChange={(e) => setSearchedGame(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchGame()}
              />
              <button
                onClick={searchGame}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
              >
                Search
              </button>
            </div>

            {selectedGames.length > 0 && (
              <div className="mt-6 p-4 border border-rose-200 rounded-lg bg-rose-50">
                <h3 className="font-semibold text-gray-900 mb-3">Selected Games ({selectedGames.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGames.map((game) => (
                    <span
                      key={game.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-200 rounded-full text-sm text-rose-700"
                    >
                      {game.name}
                      <button
                        onClick={() => setSelectedGames(prev => prev.filter(g => g.id !== game.id))}
                        className="text-rose-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {games.length > 0 ? (
              games.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  <img
                    src={item.background_image}
                    className="w-16 h-16 flex-shrink-0 rounded-lg object-cover"
                    alt={item.name}
                  />
                  <span className="text-base font-medium text-gray-900 flex-1">
                    {item.name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGames((prev) =>
                        prev.some((g) => g.id === item.id)
                          ? prev.filter((g) => g.id !== item.id)
                          : [...prev, item]
                      )
                    }}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${selectedGames.some((g) => g.id === item.id)
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                      }`}
                  >
                    {selectedGames.some((g) => g.id === item.id) ? 'Remove' : 'Add'}
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">No games found</div>
                <p className="text-sm text-gray-500">Try searching for your favorite games</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
      {msg ? (
            <Alert msg={msg} />
            ) : (
              err && <Alert err={err} />
            )}
    </form>
  )
}

export default CreateList