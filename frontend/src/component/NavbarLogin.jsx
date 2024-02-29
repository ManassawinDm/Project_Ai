import React, { useContext, useState } from "react";
import { AuthContext } from "../../../api/context/authContext";
import { Link, useNavigate } from "react-router-dom";

function NavbarLogin() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);

  // Local state to manage the visibility of the dropdown
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to="/home"><span>Trading Bot</span></Link>
      </div>
      <div className="flex items-center gap-4">
        <a href="/downloads" className="hover:bg-gray-700 px-3 py-2 rounded">
          Downloads Bot
        </a>
        <a href="/qa" className="hover:bg-gray-700 px-3 py-2 rounded">
          Q&A
        </a>
        <div
          className="relative"
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <span className="px-3 py-2 cursor-pointer">
            Welcome: {currentUser?.username}
          </span>
          {isDropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
            </div>
          )}
        </div>
        {currentUser ? (
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition duration-300"
          >
            Logout
          </button>
        ) : (
          navigate("/")
        )}
      </div>
    </nav>
  );
}

export default NavbarLogin;
