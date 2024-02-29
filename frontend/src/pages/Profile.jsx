import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../component/authContext';
import axios from "axios"

function Profile() {
    const navigate = useNavigate();

    const handlePay=()=>{
        navigate("/pay")
    }
    const [message, setmessage] = useState(null)
    const [userEmail, setuserEmail] = useState(null);
  const { authToken } = useContext(AuthContext);
  const [portNumbers, setPortNumbers] = useState([]); // Example port numbers
  const [selectedPortNumber, setSelectedPortNumber] = useState('');
  const [NewPort, setNewPort] = useState('');

  const handleAddPortChange = (event) => {
    setNewPort(event.target.value);
  };

  const handlePortNumberChange = (event) => {
    // console.log("HERE " ,event.target.value)
    setSelectedPortNumber(event.target.value);
    // console.log(selectedPortNumber)
  };

  const submitchange = async () => {
    try {
      await axios.post('http://localhost:8800/api/user/addPort', { portNumber: NewPort }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Port added successfully');
      setPortNumbers(prevPortNumbers => [...prevPortNumbers, NewPort]);
      setNewPort('');
      setmessage('Port added successfully')
    } catch (error) {
      setmessage(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/user/fetchUserData', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        // console.log(response.data.userData.port_numbers)
        setuserEmail(response.data.userData.email);
        setPortNumbers(response.data.userData.port_numbers);
        console.log(response.data.userData.port_numbers)
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (authToken) {
      fetchUserData();
    }
  }, [authToken]);
  if (!userEmail) {
    return <div>Loading...</div>;
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
            <div className="space-y-6">
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="email"
                placeholder={userEmail}
                disabled
              />
              {/* <input
                className="w-full px-4 py-3 border rounded-lg"
                type="password"
                placeholder="Password"
              />
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="password"
                placeholder="Confirm Password"
              /> */}
               <div className="mb-6">
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
            Add port
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="add port"
            type="text"
            placeholder="add port number"
            value={NewPort} 
            onChange={handleAddPortChange}

          />
        </div>
        <div className="flex items-start mb-6 text-red-500 justify-center">
            {message}
          </div>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"  onClick = { () => submitchange()}>
                Save changes
              </button>
            </div>
          </div>

          {/* New Form */}
          <div className=" flex items-center bg-white rounded-lg shadow-lg p-8 flex-grow ml-20 ">
            <form className="space-y-6">
            <select
            id="portNumber"
            className="w-full px-4 py-3 border rounded-lg"
            value={selectedPortNumber}
            onChange={handlePortNumberChange}
          >

            {portNumbers.map((portNumber, index) => (
              <option key={index} value={portNumber}>
                {portNumber}
              </option>
            ))}
          </select>
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
            Commission
          </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                type="tel"
                placeholder="10.356 Bath"
                disabled
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
