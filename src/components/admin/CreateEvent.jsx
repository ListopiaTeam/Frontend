import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Alert from '../Alert.jsx'
import { uploadFile } from "../../utility/uploadFile"
import { addEvent } from "../../utility/crudUtility"

const CreateEvent = () => {
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleEventCreation = async (data) => {
    try {
      const file = data?.file ? data.file[0] : null;

      const { url, id } = file ? await uploadFile(file) : {};

      const formData = {
        title: data.eventName,
        desc: data.eventDesc,
        endDate: new Date(data.eventDate),
        eventImage: url,
        submitedLists: [],
        isActive: true,
      };

      await addEvent(formData);
      setMessage("Successfull event creation!")
      setTimeout(() => {
        setMessage("")
      }, 3000)
    } catch (error) {
      console.log(error);
      setErrorMessage("Error creating event")
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Event</h2>
      <div className="bg-white shadow-md p-6 rounded-lg">
        <form onSubmit={handleSubmit(handleEventCreation)}>
          <div className="mb-4">
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              {...register("eventName", { required: "Event name is required" })}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700">
              Event Description
            </label>
            <input
              type="text"
              id="eventDesc"
              {...register("eventDesc", { required: "Event description is required" })}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.eventDesc && <p className="text-red-500 text-sm">{errors.eventDesc.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              {...register("eventDate", { required: "Event date is required" })}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <input
              type="file"
              {...register("file", { required: "Event image is required" })}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-all"
          >
            Create Event
          </button>
        </form>
      </div>
      {message ? (
        <Alert msg={message} />
      ) : (
        errorMessage && <Alert err={errorMessage} />
      )}
    </div>
  )
}

export default CreateEvent