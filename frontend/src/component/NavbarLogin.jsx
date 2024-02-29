// import React, { useContext } from 'react';
// import { AuthContext } from '../component/authContext';
// import { useNavigate,Link } from 'react-router-dom';


// function NavbarLogin() {
//   const navigate = useNavigate()
//   const handleNavigate = (path) => () => {
//     navigate(path);
//   };
//   const {authToken,logout} = useContext(AuthContext)

//   return (
//     <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
//       <div className="font-bold text-xl">Trading Bot</div>
//       <div className="flex items-center gap-4">
//       <button onClick={handleNavigate('/downloads')} className="hover:bg-gray-700 px-3 py-2 rounded">
//           Downloads Bot
//         </button>
//         <button onClick={handleNavigate('/qa')} className="hover:bg-gray-700 px-3 py-2 rounded">
//           Q&A
//         </button>
//         {authToken && <Link to="/profile" className="hover:bg-gray-700 px-3 py-2 rounded">Profile</Link>}
//         {authToken?<button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition duration-300">
//           Logout
//         </button>:navigate("/")}
//         {!authToken && <button onClick={handleNavigate('/login')} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition duration-300">
//           Login
//         </button>}
//       </div>
//     </nav>
//   );
// }

// export default NavbarLogin;
