import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAttendance, addAttendance } from "../utils/data";
import Button from "../components/Buttons";

export default function Dash() {
  const { currentUser } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Confirmation popup
  const [confirmAction, setConfirmAction] = useState(null); // "login" | "logout" | null

  // 🔹 Toast notification
  const [toast, setToast] = useState(null);

  // 🔹 Helper: filter + sort history (last 30 days, latest first)
  const getFilteredHistory = (records) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return records
      .filter((r) => r.empId === currentUser.id && new Date(r.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const allRecords = getAttendance();
    const today = new Date().toDateString();

    const record = allRecords.find(
      (r) => r.empId === currentUser.id && r.date === today
    );
    setTodayRecord(record || null);

    if (!record) setStatus("Not Logged In");
    else if (record.logoutTime) setStatus("Logged Out");
    else setStatus("Logged In");

    // 🔹 Apply filter + sort
    setHistory(getFilteredHistory(allRecords));

    setLoading(false);
  }, [currentUser]);

  // 🔹 Toast helper
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000); // auto hide after 3 sec
  };

  // 🔹 Perform login
  const handleLogin = () => {
    const today = new Date().toDateString();
    const allRecords = getAttendance();
    const record = allRecords.find(
      (r) => r.empId === currentUser.id && r.date === today
    );

    if (record) {
      alert("Already logged in today");
      return;
    }

    const newRecord = {
      empId: currentUser.id,
      date: today,
      loginTime: new Date().toLocaleTimeString(),
      logoutTime: null,
    };

    addAttendance(newRecord);
    setTodayRecord(newRecord);
    setStatus("Logged In");
    setHistory(getFilteredHistory([...history, newRecord]));
    showToast("✅ Logged in successfully!");
  };

  // 🔹 Perform logout
  const handleLogout = () => {
    if (!todayRecord || todayRecord.logoutTime) {
      alert("Already logged out or not logged in yet");
      return;
    }

    const allRecords = getAttendance();
    const idx = allRecords.findIndex(
      (r) => r.empId === currentUser.id && r.date === todayRecord.date
    );

    if (idx !== -1) {
      allRecords[idx].logoutTime = new Date().toLocaleTimeString();
      localStorage.setItem("attendance", JSON.stringify(allRecords));
      setTodayRecord(allRecords[idx]);
      setStatus("Logged Out");
      setHistory(getFilteredHistory(allRecords));
      showToast("🚪 Logged out successfully!");
    }
  };

  // 🔹 Handle confirm modal
  const confirmYes = () => {
    if (confirmAction === "login") handleLogin();
    if (confirmAction === "logout") handleLogout();
    setConfirmAction(null);
  };

  const confirmNo = () => setConfirmAction(null);

  if (loading) return <p className="text-center mt-20 text-lg">Loading...</p>;
  if (!currentUser) return <p className="text-center mt-20 text-lg">Please login first</p>;

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 pt-30 relative">
      <div className="w-full max-w-8xl bg-white shadow rounded-lg p-4 sm:p-8 mt-30">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-lg sm:text-xl font-semibold text-orange-400 mb-4">
          Welcome, {currentUser.name}
        </p>

        {/* Status */}
        <p className="text-sm sm:text-base text-end font-semibold -mt-10 sm:-mt-20">
          Status: {status}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
          {!todayRecord && (
            <Button label="Login" onClick={() => setConfirmAction("login")} />
          )}
          {todayRecord && !todayRecord.logoutTime && (
            <Button label="Logout" onClick={() => setConfirmAction("logout")} />
          )}
        </div>

        {/* Today's login/logout info */}
        {todayRecord?.loginTime && (
          <p className="mt-2 text-green-600 text-end text-sm sm:text-base">
            ✅ Logged in at {todayRecord.loginTime}
          </p>
        )}
        {todayRecord?.logoutTime && (
          <p className="mt-2 text-red-600 text-end text-sm sm:text-base">
            🚪 Logged out at {todayRecord.logoutTime}
          </p>
        )}

        {/* History Table */}
        <div className="overflow-x-auto mt-4">
          <h3 className="text-xl font-bold mt-8 mb-2">Attendance History (Last 30 Days)</h3>
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Login Time</th>
                <th className="py-2 px-4 border">Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.date}>
                  <td className="py-2 px-4 border">{r.date}</td>
                  <td className="py-2 px-4 border">{r.loginTime}</td>
                  <td className="py-2 px-4 border">{r.logoutTime || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Floating Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center w-80 pointer-events-auto transform transition-transform duration-300 scale-105">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to{" "}
              <span className="text-orange-500">{confirmAction}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                onClick={confirmYes}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                onClick={confirmNo}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
