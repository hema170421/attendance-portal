import React from "react";

export default function Button({ label, onClick, color }) {
  const base =
    "px-10 py-3 sm:py-3 rounded-xl shadow-md font-semibold text-white transition-transform hover:scale-105 text-sm sm:text-base";
  const colors = {
    orange: "bg-gradient-to-r from-orange-400 to-black",
    black: "bg-gradient-to-r from-orange-400 to-black",

    
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${colors[color] || colors.orange} w-full sm:w-auto`}
    >
      {label}
    </button>
  );
}
