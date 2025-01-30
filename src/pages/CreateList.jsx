import React from 'react'
import TemplateList from '../components/TemplateList'

const CreateList = () => {
  return (
    <div className='flex flex-col items-center justify-center mt-24'>
      <TemplateList/>
      <button>Submit List</button>
    </div>
  )
}

export default CreateList