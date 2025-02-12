import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addComment, readLists } from "../utility/crudUtility";
import { toggleLike } from "../utility/crudUtility";
import { UserContext } from "../UserContext";

const ListDetail = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [list, setList] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [currentComment, setCurrentComment] = useState([]);
 
  

  useEffect(() => {
    readLists(id, setList);
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
    toggleLike(id, user.uid);
    if (isLiked) {
      setCurrentLikes(currentLikes.filter((like) => like !== user.uid));
    } else {
      setCurrentLikes([...currentLikes, user.uid]);
    }
    setIsLiked(!isLiked);
  };

  function handleComment() {
    const commentText = document.querySelector("textarea").value.trim();

    if (!commentText) return;
    const newComment = {
      content: commentText,
      listId: id,
      parentId: null,
      timestamp: new Date().toUTCString(),
      userId: user?.uid,
      username:user.displayName
    };
    setCurrentComment((prevComments) => [...prevComments, newComment]);
    document.querySelector("textarea").value = "";
    console.log("New comment added:", newComment);

    addComment(id, newComment);
  }

  function handleCommentResponse() {
    const commentText = document.querySelector("textarea").value.trim();

    if (!commentText) return;
    const newComment = {
      content: commentText,
      listId: id,
      parentId: null,
      timestamp: new Date().toUTCString(),
      userId: user?.uid,
      username:user.displayName
    };
    setCurrentComment((prevComments) => [...prevComments, newComment]);
    document.querySelector("textarea").value = "";
    console.log("New comment added:", newComment);

    addComment(id, newComment);
  }

  if (!list?.games) {
    return (
      <div className="min-h-screen mt-32 max-w-4xl mx-auto text-rose-600 text-4xl font-semibold!">
        List is not available!
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 mt-16">
      {list && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 group transition-colors absolute sm:right-52 sm:top-12 right-20 top-24"
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
                {list.likes.length}
              </span>
            </button>
            <button className="absolute top-10 right-20 bg-rose-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-rose-700 transition duration-300">
              Report list
            </button>

            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {list.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
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
                  <div
                    key={game.id}
                    className="group bg-white hover:bg-gray-50 border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                          {game.name}
                        </h3>
                        <div className="mt-2 flex items-center flex-wrap gap-4 text-gray-600">
                          <p className="flex items-center gap-1">
                            ⭐
                            <span className="font-medium">
                              {game.rating}
                              <span className="text-gray-400 ml-1">/5</span>
                            </span>
                          </p>
                          {game.released && (
                            <p className="flex items-center gap-1">
                              <span className="text-gray-400">Released:</span>
                              <span className="font-medium">
                                {new Date(game.released).toLocaleDateString()}
                              </span>
                            </p>
                          )}
                        </div>
                        <p>
                          {" "}
                          <span className="font-bold">Available at:</span>{" "}
                          {game.stores
                            ?.map((store) => store.store.name)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Comments
              </h2>
              <div className="bg-gray-100 p-6 rounded-xl">
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                  rows="4"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={handleComment}
                  className="mt-3 px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all"
                >
                  Post Comment
                </button>
                <div className="mt-6 space-y-4">
                  {list.comments && list.comments.length > 0 ? (
                    list.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <p className="font-semibold">{comment.username}</p>
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetail;
