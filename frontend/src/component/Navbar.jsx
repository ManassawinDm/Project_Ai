import React, { useContext,useState } from 'react';
import { AuthContext } from '../component/authContext';
import { Link, useNavigate } from 'react-router-dom'; 

function Navbar() {
  const navigate = useNavigate();
  const { authToken, logout, username } = useContext(AuthContext);
  const handleNavigate = (path) => () => {
    navigate(path);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="font-bold text-xl">
      {authToken ? (
          <Link to="/home"><span>Trading Bot</span></Link>
        ) : (
          <Link to="/"><span>Trading Bot</span></Link>
        )}
        </div>
      <div className="flex items-center gap-4">
        {authToken && <button onClick={handleNavigate('/downloads')} className="hover:bg-gray-700 px-3 py-2 rounded">
          Downloads Bot
        </button>}
        <button onClick={handleNavigate('/qa')} className="hover:bg-gray-700 px-3 py-2 rounded">
          Q&A
        </button>
        {authToken && (
          <div
            className="relative"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <span className="px-3 py-2 cursor-pointer">
              Welcome: {username} {/* Directly using username */}
            </span>
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        )}
        {authToken ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition duration-300">
            Logout
          </button>
        ) : (
          <button onClick={handleNavigate('/login')} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition duration-300">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
