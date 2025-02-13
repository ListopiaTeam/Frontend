import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { serverTimestamp } from "firebase/firestore";
import { addComment } from "../utility/crudUtility";

const CommentSection = ({ currentComment, listId }) => {
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const { user } = useContext(UserContext);

  const commentTree = currentComment.reduce((acc, comment) => {
    if (comment.parentId) {
      acc[comment.parentId] = acc[comment.parentId] || [];
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {});

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyChange = (commentId, text) => {
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: text,
    }));
  };

  const handleReplySubmit = (commentId) => {
    const replyText = replyInputs[commentId]?.trim();
    if (!replyText) return;

    console.log(`Reply to comment ${commentId}:`, replyText);

    const newReply = {
      content: replyText,
      listId: listId,
      parentId: commentId,
      timestamp: serverTimestamp(),
      userId: user?.uid,
      username: user?.displayName,
    };

    addComment(listId, newReply);

    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: "",
    }));

    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  return (
    <div className="mt-6 space-y-4">
      {currentComment.length > 0 ? (
        currentComment
          .filter((comment) => !comment.parentId)
          .map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
              <p className="font-semibold">{comment.username}</p>
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-sm text-gray-500">
                {comment.timestamp?.seconds
                  ? new Date(comment.timestamp.seconds * 1000).toLocaleString()
                  : "Just now"}
              </p>

              <button
                onClick={() => toggleReplyInput(comment.id)}
                className="mt-2 text-blue-500 hover:underline text-sm font-medium"
              >
                Reply
              </button>

              {commentTree[comment.id] && (
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="ml-4 text-gray-500 hover:underline text-sm font-medium"
                >
                  {showReplies[comment.id]
                    ? "Hide Replies"
                    : `View Replies (${commentTree[comment.id].length})`}
                </button>
              )}

              {showReplyInput[comment.id] && (
                <div className="mt-2 pl-4 border-l-2 border-gray-300">
                  <textarea
                    value={replyInputs[comment.id] || ""}
                    onChange={(e) =>
                      handleReplyChange(comment.id, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                    placeholder="Write a reply..."
                    rows="2"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    Reply
                  </button>
                </div>
              )}

              {showReplies[comment.id] && commentTree[comment.id] && (
                <div className="mt-3 pl-6 border-l-2 border-gray-200">
                  {commentTree[comment.id].map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-gray-100 p-3 rounded-lg shadow mt-2"
                    >
                      <p className="font-semibold">{reply.username}</p>
                      <p className="text-gray-700">{reply.content}</p>
                      <p className="text-sm text-gray-500">
                        {reply.timestamp?.seconds
                          ? new Date(reply.timestamp.seconds * 1000).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
      ) : (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};
export default CommentSection;
