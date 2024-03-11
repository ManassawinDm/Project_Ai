import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../component/authContext';

function Login() {
  const [input, setinput] = useState({
    email: "",
    password: "",
  })
  const [showerr, seterr] = useState(null)
  const navigate = useNavigate()
  const {login ,loginError } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setinput(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    seterr(null);
  
    try {
      const response = await login(input);
      console.log(response);
      // navigate("/home");
    } catch (err) {
      console.error("Login error:",  err.response.data);
    const errorMessage = err.response.data || "An error occurred during login.";
    seterr(errorMessage)
    }
  };
  useEffect(()=>{
    if(authToken){
      navigate("/home")
    }
  },[authToken])
  return (
     <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div class="mt-12 flex flex-col items-center">
            <div class="w-full flex-1 mt-36">
            <div class="my-12 border-b text-center">
                        <div
                            class="leading-none px-2 inline-block text-lg text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                            Sign Into Your Account
                        </div>
                    </div>
              

              <div class="mx-auto max-w-xs">
              <form>
                <input
                  class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
                <input
                  class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
                {showerr && <label className="text-red-500">{showerr}</label>}
                <button
                  className="text-white bg-[#00df9a] hover:bg-[#44967c] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center mt-10"
                  onClick={handleSubmit}
                >
                  Sign in
                </button>
                </form>
                <span className="mt-5">Don't you have an account? <Link to="/register" className="text-blue-600 underline">Register</Link></span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 bg-green-200 text-center hidden lg:flex">  
          <div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
