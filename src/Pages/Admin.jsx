import React, { useState, useEffect } from "react";
import Button from "../components/Buttons";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getAttendance,
} from "../utils/data";

export default function Admin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [employees, setEmployees] = useState([]);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  const [editId, setEditId] = useState(null);

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [loggedInEmployees, setLoggedInEmployees] = useState(0);

  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdminLoggedIn");
    if (loggedIn === "true") setIsAdminLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadEmployees();
      const interval = setInterval(loadEmployees, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn]);

  const loadEmployees = () => {
    const emps = getEmployees().sort((a, b) => a.name.localeCompare(b.name));
    setEmployees(emps);
    setTotalEmployees(emps.length);
    updateAttendanceStats();
  };

  const updateAttendanceStats = () => {
    const attendance = getAttendance();
    const today = new Date().toDateString();
    const todayRecords = attendance.filter((r) => r.date === today);
    setAttendanceToday(todayRecords.length);
    const loggedIn = todayRecords.filter((r) => !r.logoutTime);
    setLoggedInEmployees(loggedIn.length);
  };

  const handleAdminLogin = () => {
    if (adminEmail === "admin@company.com" && adminPassword === "admin123") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("isAdminLoggedIn", "true");
    } else {
      alert("Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("isAdminLoggedIn");
    setAdminEmail("");
    setAdminPassword("");
  };

  const handleSaveEmployee = () => {
    if (!empName || !empEmail || !empPassword) return alert("Fill all fields");

    if (editId) {
      updateEmployee({ id: editId, name: empName, email: empEmail, password: empPassword });
      setEditId(null);
    } else {
      addEmployee({ id: Date.now(), name: empName, email: empEmail, password: empPassword });
    }
    loadEmployees();
    setEmpName("");
    setEmpEmail("");
    setEmpPassword("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteEmployee(id);
      loadEmployees();
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setEmpName(emp.name);
    setEmpEmail(emp.email);
    setEmpPassword(emp.password);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
        <div className="w-full max-w-md bg-white shadow rounded-lg p-8 flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold text-orange-400">Admin Login</h2>
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          />
          <Button label="Login" color="blue" onClick={handleAdminLogin} />
        </div>
      </div>
    );
  }

  const filteredEmployees = employees
    .filter((emp) => emp.name.toLowerCase().includes(searchName.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-10 pt-35">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-400">Admin Panel</h2>
        <Button label="Logout" onClick={handleLogout} />
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <div className="flex-1 text-center sm:bg-blue-50 sm:shadow sm:rounded-lg p-2 sm:p-4">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalEmployees}</p>
        </div>
        <div className="flex-1 text-center sm:bg-green-50 sm:shadow sm:rounded-lg p-2 sm:p-4">
          <h3 className="text-lg font-semibold">Attendance Today</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{attendanceToday}</p>
        </div>
        <div className="flex-1 text-center sm:bg-orange-50 sm:shadow sm:rounded-lg p-2 sm:p-4">
          <h3 className="text-lg font-semibold">Logged In Employees</h3>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">{loggedInEmployees}</p>
        </div>
      </div>

      {/* Employee Form */}
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
        <input
          className="px-4 py-2 border rounded flex-1 min-w-full sm:min-w-[200px]"
          placeholder="Name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
        />
        <input
          className="px-4 py-2 border rounded flex-1 min-w-full sm:min-w-[200px]"
          placeholder="Email"
          value={empEmail}
          onChange={(e) => setEmpEmail(e.target.value)}
        />
        <input
          className="px-4 py-2 border rounded flex-1 min-w-full sm:min-w-[200px]"
          placeholder="Password"
          value={empPassword}
          onChange={(e) => setEmpPassword(e.target.value)}
        />
        <Button
          label={editId ? "Update Employee" : "Add Employee"}
          color="green"
          onClick={handleSaveEmployee}
        />
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
        <input
          className="px-3 py-2 border rounded w-full sm:w-64"
          placeholder="Search Employee by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          className="px-3 py-2 border rounded w-full sm:w-auto"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Employee Table / Cards */}
      <div className="overflow-x-auto">
        <table className="min-w-full border sm:shadow sm:rounded-lg">
          <thead className="bg-blue-100 text-blue-800 font-semibold">
            <tr className="hidden sm:table-row">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              {!searchName && !filterDate && (
                <>
                  <th className="py-2 px-4 border">Today Login</th>
                  <th className="py-2 px-4 border">Today Logout</th>
                </>
              )}
              {(searchName || filterDate) && <th className="py-2 px-4 border">Attendance History</th>}
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const attendance = getAttendance()
                .filter((r) => r.empId === emp.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
              const todayRecord = attendance.find((r) => r.date === new Date().toDateString());

              return (
                <React.Fragment key={emp.id}>
                  {/* Desktop Row */}
                  <tr className="hidden sm:table-row hover:bg-gray-50">
                    <td className="py-2 px-4 border">{emp.id}</td>
                    <td className="py-2 px-4 border">{emp.name}</td>
                    <td className="py-2 px-4 border">{emp.email}</td>
                    {!searchName && !filterDate && (
                      <>
                        <td className="py-2 px-4 border">{todayRecord?.loginTime || "-"}</td>
                        <td className="py-2 px-4 border">{todayRecord?.logoutTime || "-"}</td>
                      </>
                    )}
                    {(searchName || filterDate) && (
                      <td className="py-2 px-4">
                        {attendance.map((r) => (
                          <div key={r.date + r.loginTime} className="text-sm mb-1">
                            {r.date}: {r.loginTime || "-"} / {r.logoutTime || "-"}
                          </div>
                        ))}
                      </td>
                    )}
                    
                    <td className="py-2 px-4 border">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-gray-200 text-black px-3 py-1 rounded"
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-gray-200 text-black px-3 py-1 rounded"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>

                  {/* Mobile Card */}
                  <tr className="sm:hidden">
                    <td className="p-0">
                      <div className="border rounded-lg shadow p-4 mb-4 bg-white">
                        <div className="mb-1"><strong>ID:</strong> {emp.id}</div>
                        <div className="mb-1"><strong>Name:</strong> {emp.name}</div>
                        <div className="mb-1"><strong>Email:</strong> {emp.email}</div>
                        {!searchName && !filterDate && (
                          <>
                            <div className="mb-1"><strong>Today Login:</strong> {todayRecord?.loginTime || "-"}</div>
                            <div className="mb-1"><strong>Today Logout:</strong> {todayRecord?.logoutTime || "-"}</div>
                          </>
                        )}
                        {(searchName || filterDate) && (
                          <div className="mb-1">
                            <strong>Attendance:</strong>
                            {attendance.map((r) => (
                              <div key={r.date + r.loginTime} className="text-sm">
                                {r.date}: {r.loginTime || "-"} / {r.logoutTime || "-"}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button className="bg-gray-200 px-3 py-1 rounded flex-1" onClick={() => handleEdit(emp)}>
                            Edit
                          </button>
                          <button className="bg-gray-200 px-3 py-1 rounded flex-1" onClick={() => handleDelete(emp.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
