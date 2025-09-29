import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getEmployees } from "../utils/data";
import Button from "../components/Buttons";

export default function Login() {
  const { setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const employees = getEmployees();
    if (email === "admin@company.com" && password === "admin123") {
      setCurrentUser({ name: "Admin", email, role: "admin" });
      navigate("/admin");
    } else {
      const user = employees.find(e => e.email === email && e.password === password);
      if (user) {
        setCurrentUser({ ...user, role: "employee" });
        navigate("/dash");
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <div className="w-full  max-w-2xl bg-white shadow rounded-lg p-10 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <input className="px-4 py-2 border rounded" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="px-4 py-2 border rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <Button label="Login" color="blue" onClick={handleLogin} />
      </div>
    </div>
  );
}
