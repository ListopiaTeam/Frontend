import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addComment,
  deleteList,
  getUser,
  listenToComments,
  readLists,
} from "../utility/crudUtility";
import { toggleLike } from "../utility/crudUtility";
import { UserContext } from "../UserContext";
import { serverTimestamp } from "firebase/firestore";
import CommentSection from "../components/CommentSection";
import ReportModal from "../components/ReportModal";
import GoBackButton from "../components/GoBackButton";
import { useQuery } from "@tanstack/react-query";
import GameDetailModal from "../components/GameDetailModal";

const ListDetail = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [currentPostUser, setCurrentPostUser] = useState(null); 

  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [currentComment, setCurrentComment] = useState([]);

  const { data: list, isLoading, error } = useQuery({
    queryKey: ["list", id],
    queryFn: () => readLists(id),
  });

  useEffect(() => {
    if (!id) return;
    const unsubscribe = listenToComments(id, setCurrentComment);
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (list?.likes) {
      setCurrentLikes(list.likes);
    }
  }, [list]);

  useEffect(() => {
    window.scrollTo(window.top);
  }, []);

  useEffect(() => {
    if (currentLikes.includes(user?.uid)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [currentLikes, user?.uid]);

  const handleLike = () => {
    toggleLike(id, user?.uid);
    if (isLiked) {
      setCurrentLikes(currentLikes.filter((like) => like !== user?.uid));
    } else {
      setCurrentLikes([...currentLikes, user?.uid]);
    }
    setIsLiked(!isLiked);
  };
    
  const handleComment = () => {
    const commentText = document.querySelector("textarea").value.trim();
    if (!commentText) return;

    const newComment = {
      content: commentText,
      listId: id,
      parentId: null,
      timestamp: serverTimestamp(),
      userId: user?.uid,
      username: user?.displayName,
      reports:[],
    };
    setCurrentComment((prevComments) => [...prevComments, newComment]);

    document.querySelector("textarea").value = "";

    console.log("New comment added:", newComment);

    addComment(id, newComment);
  };

  const getPostUser = async () => {
    try {
      const user = await getUser(list?.userID);
      
      setCurrentPostUser(user); 
    } catch (error) {
      console.error('Error fetching user:', error); 
    }

  }

  useEffect(() => {
    getPostUser()
  }, [list?.userID])

  if (!list?.games) {
    return (
      <div className="min-h-screen mt-32 max-w-4xl mx-auto text-rose-600 text-4xl font-semibold!">
        List is not available!
      </div>
    );
  }  

  const copyToClipboard = () => {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy the URL: ', err);
      });
  };

  return (
    <div className="min-h-screen py-16 mt-16">
      <GoBackButton/>
      {list && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
       
            <button
              onClick={user && handleLike}
              disabled={!user}
              className={`flex items-center gap-1.5 group transition-colors w-fit absolute right-14 top-14`}
              aria-label={isLiked ? "Remove like" : "Like this game"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-all ${
                  isLiked
                    ? "text-rose-500 fill-rose-500"
                    : "text-gray-900 fill-transparent stroke-current stroke-[2px]"
                }`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  isLiked ? "text-rose-500" : "text-gray-500"
                }`}
              >
                {currentLikes.length}
              </span>
            </button>

            <div className="flex gap-5 md:flex-row flex-col">
              <ReportModal id={id} user={user}/>
              <button
                className={`mt-3 px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all mb-10`}
                onClick={copyToClipboard}>Share list
              </button>
            </div>

            <div className="mb-8 mt-24 md:mt-0">
              <p className="font-bold mb-10 text-lg">
                Created by: <span className="text-rose-600">{currentPostUser?.displayName || "Deleted User"}</span> 
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 break-words max-w-md">
                {list.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed break-words max-w-prose">
                {list.desc}
              </p>
            </div>

            {list?.categories.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {list.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium transition-transform hover:scale-105"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Games in this List
              </h2>
              <div className="space-y-6">
                {list.games.map((game) => (
                  
                  <GameDetailModal key={game.id} user={user} game={game} />
                ))}
              </div>
            </div>
            {list.userID === user?.uid && (
              <div className="text-right">
                <button
                  onClick={() => {
                    deleteList(id);
                  }}
                  className="mt-3 px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all"
                >
                  Delete list
                </button>
              </div>
            )}
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Comments
              </h2>
              <div className="bg-gray-100 p-6 rounded-xl">
                <textarea
                  className={`${!user && "hidden"} w-full p-3 rounded-lg border border-gray-300 focus:ring-rose-500 focus:border-rose-500`}
                  rows="4"
                  maxLength="120"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={handleComment}
                  className={`${!user && "hidden"} mt-3 px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all`}
                >
                  Post Comment
                </button>
                <CommentSection
                  currentComment={currentComment}
                  listId={id}
                  userUid={user?.uid}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetail;