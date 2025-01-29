import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { extractUrlAndId } from "../utility/utils";
import { deletePhoto, uploadFile } from "../utility/uploadFile.js";

export default function Profile() {
  const { user, updateCredentials, deleteAccount, logoutUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const userImgId = user?.photoURL ? extractUrlAndId(user.photoURL).id : null;

  useEffect(() => {
    user?.photoURL && setAvatar(extractUrlAndId(user.photoURL).url);
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const file = data?.file ? data.file[0] : null;
      const { url, id } = file ? await uploadFile(file) : {};
      updateCredentials(data.displayName, file ? `${url}/${id}` : user.photoURL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePhoto(userImgId);
      deleteAccount();
      logoutUser();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  return (
    <div className="mt-32 flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg m-auto gap-5 flex flex-col mx-5">
        <h2 className="text-center text-3xl font-semibold">Profile</h2>
        
        {avatar && (
          <div className="w-24 h-24 mx-auto mb-5 border-2 border-rose-600 rounded-lg overflow-hidden flex items-center justify-center bg-gray-700">
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}

        <label className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
          <input
            {...register("displayName", { required: "Username is required" })}
            placeholder="Username"
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />
          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none">
            Username
          </span>
        </label>
        {errors.displayName && <p className="text-red-400 mt-2">{errors.displayName.message}</p>}

        <label className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
          <input
            type="file"
            {...register("file")}
            onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
          />
          <span className="absolute start-3 top-3 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none">
            Profile Picture
          </span>
        </label>
        {errors.file && <p className="text-red-400 mt-2">{errors.file.message}</p>}

        <button className="block rounded border-solid bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring sm:w-auto" type="submit">
          Save Changes
        </button>

        <button className="block rounded border border-rose-600 px-12 py-3 text-sm font-medium text-rose-600 shadow-sm hover:bg-slate-200 focus:outline-none focus:ring focus:ring-rose-300 active:bg-rose-700 sm:w-auto" type="button" onClick={handleDelete}>
          Delete Account
        </button>
      </form>
    </div>
  );
}
