import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../component/authContext';

function Login() {
  const [input, setinput] = useState({
    email: "",
    password: "",
  })
  const [showerr, seterr] = useState(null)
  const navigate = useNavigate()
  const {login } = useContext(AuthContext);

  const handleChange = (e) => {
    setinput(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await login(input)
      navigate("/home")
    } catch (err) {
      console.error("Registration error:", err);
      seterr(err.response.data);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-indigo-200">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-10">Sign Into Your Account</h1>
        <form>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email / Username</label>
            <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg p-2">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-300">
                <i className="fas fa-user"></i>
              </span>
              <input type="text" id="email" className="bg-gray-50 outline-none flex-1" placeholder="name@company.com" name="email" onChange={handleChange} />
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg p-2">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-300">
                <i className="fas fa-lock"></i>
              </span>
              <input type="password" id="password" className="bg-gray-50 outline-none flex-1" placeholder="•••••••••" name="password" onChange={handleChange} />
            </div>
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5 justify-center">
             {showerr}
            </div>
          </div>
          <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" onClick={handleSubmit}>Sign in</button>
          <span className="mt-5">Don't you have an account? <Link to="/register" className="text-blue-600 underline">Register</Link></span>
        </form>
      </div>
    </div>
  );
}

export default Login;
