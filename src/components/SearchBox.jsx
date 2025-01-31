import React from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { searchGamesByName } from '../utility/rawgAPI'

const SearchBox = ({setGames, games, setSelectedGames}) => {
  console.log(games);
  
    const handleOnSearch = (string, results) => {
      console.log(string);
      
      searchGamesByName(setGames, string)
      }
      
      const handleOnHover = (result) => {
        // the item hovered
        // console.log(result)
      }
    
      const handleOnSelect = (item) => {
        // the item selected
        setSelectedGames((prevSelected) => [...prevSelected, item])
      }
    
      const handleOnFocus = (string) => {
        console.log('Focused')
      }
    
      const formatResult = (item) => {
        return (
          <>
       <div className='flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 transition-colors'>
        <img src={item.background_image} className='w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md' alt={item.name} />
        <span className='text-base sm:text-lg font-semibold text-gray-800 text-center sm:text-left'>
            {item.name}
        </span>
</div>


          </>
        )
      }
  return (
    <div style={{ width: 'auto' }}>
        <ReactSearchAutocomplete
            items={games}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            placeholder={"Search Games By Title"}
            autoFocus
            showIcon={false}
            formatResult={formatResult}
            inputDebounce={1000}
        />
  </div>
    
  )
}

export default SearchBox