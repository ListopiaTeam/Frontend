import React, { useState } from 'react';
import { serverTimestamp } from "firebase/firestore";
import { addCommentReport } from "../utility/crudUtility"; // Assuming this is the correct import
import Alert from "../components/Alert";

export default function CommentReportModal({ listId, commentId, userId }) {
  
  const reportReasons = [
    "Hate Speech",
    "Harassment or Bullying",
    "Misinformation or False Information",
    "Spam",
    "Violence or Threats",
    "Explicit Content",
    "Illegal Activity",
    "Privacy Violations",
    "Impersonation",
    "Copyright or Intellectual Property Violation",
    "Self-Harm or Suicide Promotion"
  ];
  
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [alert, setAlert] = useState({ msg: "", err: false });

  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmitReport = async () => {
    if (selectedReasons.length === 0) {
      setAlert({ msg: "Please select at least one reason.", err: true });
      return;
    }

    const newReport = {
      content: selectedReasons,
      listId: listId, // Corrected: use listId here, not id
      timestamp: serverTimestamp(),
      userId: userId,
    };

    // Simply add the report without checking if the user has reported it already
    console.log("what is happening");
    
    await addCommentReport(listId, commentId, newReport);

    setAlert({
      msg: "Report submitted successfully!",
      err: false,
    });

    setTimeout(() => setAlert({ msg: "", err: false }), 3000);

    document.getElementById('report_modal_comments').close();
    setSelectedReasons([]);
  };

  const handleClose = () => {
    setSelectedReasons([]);
  };

  return (
    <>
      <button
        className={`${
          !userId && "hidden"
        } absolute top-2 right-2 p-1 bg-red-500 text-center rounded-md hover:bg-red-600 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity`}
        onClick={() => document.getElementById('report_modal_comments').showModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-exclamation text-slate-100"
          viewBox="0 0 16 16"
        >
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z" />
        </svg>
      </button>
      <dialog id="report_modal_comments" className="modal rounded-md" onClose={handleClose}>
        <div className="modal-box p-6 rounded-xl">
          <form method="dialog" className="absolute right-5 top-5">
            <button className="btn text-xl font-bold py-2 px-4 transition duration-300 text-rose-600" onClick={handleClose}>
              X
            </button>
          </form>
          <h3 className="font-bold sm:text-lg text-sm">Why would you like to report?</h3>
          <div className="py-4">
            {reportReasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`reason-${index}`}
                  value={reason}
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleCheckboxChange(reason)}
                  className="form-checkbox h-5 w-5 text-rose-500"
                />
                <label htmlFor={`reason-${index}`} className="text-gray-700">
                  {reason}
                </label>
              </div>
            ))}
          </div>
          <div className="modal-action flex gap-5 flex-col">
            <button
              onClick={handleSubmitReport}
              className="bg-rose-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-rose-700 transition duration-300"
            >
              Submit Report
            </button>
          </div>
        </div>
      </dialog>
      {alert.msg && <Alert msg={alert.msg} err={alert.err} />}
    </>
  );
}
