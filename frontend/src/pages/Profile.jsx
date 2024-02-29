import React from "react";
import { useNavigate } from "react-router-dom";


function Profile() {
    const navigate = useNavigate();

    const handlePay=()=>{
        navigate("/pay")
    }
  return (
    <div className="flex justify-center p-4 mt-8">
      {/* Wrapper for both forms with a max-width and centered */}
      <div className="flex w-full max-w-4xl">
        {/* Form Container */}
        <div className="flex flex-grow">
          {/* Existing Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex-grow">
            <div className="flex flex-col items-center pb-10">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mb-4">
                {/* Placeholder for the user's avatar */}
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                {/* Camera icon or edit icon suggested */}
              </button>
            </div>
            <form className="space-y-6">
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="text"
                placeholder="Name"
              />
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="email"
                placeholder="Email"
              />
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="password"
                placeholder="Password"
              />
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="password"
                placeholder="Confirm Password"
              />
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                Save changes
              </button>
            </form>
          </div>

          {/* New Form */}
          <div className=" flex items-center bg-white rounded-lg shadow-lg p-8 flex-grow ml-20 ">
            <form className="space-y-6">
              <select
                className="w-full px-4 py-3 border rounded-lg"
                defaultValue=""
              >
                <option value="" disabled>
                  Select your Ports
                </option>
                <option value="user1">user1</option>
                <option value="user2">user2</option>
                <option value="user3">user3</option>
              </select>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="tel"
                placeholder="Phone Number"
              />
              <button onClick={handlePay} className=" w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out  ">
                Pay Commission
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
