import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"

function Register() {
  const [input, setinput] = useState({
    email: "",
    password: "",
    portnumber: "",
  })
  const [verificationImage, setVerificationImage] = useState(null);
  const [showerr, seterr] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setinput(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  
  const handleImageChange = (e) => {
    setVerificationImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check for empty values before submitting
    if (!input.email || !input.password || !input.portnumber || !verificationImage) {
      seterr("กรุณากรอกทุกช่องและใส่รูป");
      return;
    }
  
    try {
      // Submit the registration form
      const res = await axios.post("http://localhost:8800/api/auth/register", {
        email: input.email,
        password: input.password,
        portnumber: input.portnumber,
      });
  
      const portId = res.data.portId;
      if (!portId) {
        throw new Error("Port ID not returned from registration.");
      }
  
      const formData = new FormData();
      formData.append("verificationImage", verificationImage);
      formData.append("portId", portId);
  
      // Submit the verification image
      const response = await axios.post("http://localhost:8800/api/file/upload/port", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log("Upload successful", response.data);
      navigate("/login");
  
    } catch (err) {
      console.error("Registration error:", err);
      seterr(err.response?.data?.message || "An error occurred during registration.");
    }
  };
  return (
<div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
<div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
  <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
    <div class="mt-12 flex flex-col items-center">
      <div class="w-full flex-1 mt-36">
      <div class="my-12 border-b text-center">
                  <div
                      class="leading-none px-2 inline-block text-lg text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                      Get Started Now
                  </div>
              </div>
        

        <div class="mx-auto max-w-xs">
          
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
          <input
            class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
            type="text"
            placeholder="Enter your port number"
            name='portnumber'
            onChange={handleChange}
          />
          
          <input
  type="file"
  className="mt-5 block w-full text-sm text-slate-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-green-100 file:text-green-700
    hover:file:bg-green-200"
  accept="image/png, image/jpeg,image/jpg"
  name="verifyPort" // Make sure this matches the expected field name in your backend
  onChange={handleImageChange}
/>
<div className="flex items-start mt-5 text-red-500 justify-center">          {showerr} </div>
          <button
            className="text-white bg-[#00df9a] hover:bg-[#44967c] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center mt-10"
            onClick={handleSubmit}
          >
            Register
          </button>
          <span className="mt-5">Do you have an account? <Link to="/login" className="text-blue-600 underline">Login</Link></span>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-1 bg-green-100 text-center hidden lg:flex">  
    <div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"></div>
  </div>
</div>
</div>
  )
}

export default Register