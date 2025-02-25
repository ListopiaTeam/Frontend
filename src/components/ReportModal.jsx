import React, { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { addReport } from "../utility/crudUtility";
import Alert from "../components/Alert";

const ReportModal = ({ id, user }) => {
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
      listId: id,
      timestamp: serverTimestamp(),
      userId: user?.uid,
      username: user?.displayName,
    };

    const hasReported = await addReport(id, newReport);

    setAlert({
      msg: hasReported ? "You've already reported this." : "Report submitted successfully!",
      err: hasReported,
    });

    setTimeout(() => setAlert({ msg: "", err: false }), 3000);

    document.getElementById('report_modal').close();
    setSelectedReasons([]);
  };

  const handleClose = () => {
    setSelectedReasons([]);
  };

  return (
    <>
      <button className="btn" onClick={() => document.getElementById('report_modal').showModal()}>
        Open Modal
      </button>
      <dialog id="report_modal" className="modal" onClose={handleClose}>
        <div className="modal-box p-6 rounded-xl">
          <h3 className="font-bold text-lg">Why would you like to report?</h3>
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
          {alert.msg && <Alert msg={alert.msg} err={alert.err} />}
          <div className="modal-action">
            <button
              onClick={handleSubmitReport}
              className="bg-rose-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-rose-700 transition duration-300"
            >
              Submit Report
            </button>
            <form method="dialog">
              <button className="btn" onClick={handleClose}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ReportModal;