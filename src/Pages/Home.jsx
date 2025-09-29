import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Buttons";

export default function Home() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 sm:gap-8 ">
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xl sm:text-2xl">
    <Button label="Admin" color="blue" onClick={() => navigate("/admin")} />
    <Button label="Attendance" color="green" onClick={() => navigate("/login")} />
      
  </div>
</div>

  );
}
