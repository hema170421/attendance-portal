// ../utils/data.js

// 🔹 Initialize employees and attendance in localStorage if not present
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

// 🔹 Save employees to localStorage
const saveEmployees = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

// 🔹 Save attendance to localStorage
const saveAttendance = () => {
  localStorage.setItem("attendance", JSON.stringify(attendance));
};

// 🔹 Get all employees
export const getEmployees = () => {
  employees = JSON.parse(localStorage.getItem("employees")) || [];
  return employees;
};

// 🔹 Add new employee
export const addEmployee = (emp) => {
  employees.push(emp);
  saveEmployees();
};

// 🔹 Update existing employee
export const updateEmployee = (updatedEmp) => {
  employees = employees.map((emp) =>
    emp.id === updatedEmp.id ? updatedEmp : emp
  );
  saveEmployees();
};

// 🔹 Delete employee
export const deleteEmployee = (id) => {
  employees = employees.filter((emp) => emp.id !== id);
  saveEmployees();

  // Also remove their attendance records
  attendance = attendance.filter((att) => att.empId !== id);
  saveAttendance();
};

// 🔹 Get all attendance records
export const getAttendance = () => {
  attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  return attendance;
};

// 🔹 Add attendance record
export const addAttendance = (record) => {
  attendance.push(record);
  saveAttendance();
};

// 🔹 Update attendance record (like logout)
export const updateAttendance = (empId, updates) => {
  attendance = attendance.map((att) =>
    att.empId === empId && att.date === updates.date
      ? { ...att, ...updates }
      : att
  );
  saveAttendance();
};
