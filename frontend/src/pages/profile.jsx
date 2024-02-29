import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../component/authContext';
import axios from "axios"

const Profile = () => {
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
    } catch (error) {
      console.error("Failed to add new port:", error.response.data.message);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="username"
            type="text"
            placeholder={userEmail}
            disabled
          />
        </div>
        {/* <div className="mb-6">
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
            New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"

          />
        </div> */}
        <div className="mb-6">
          <label htmlFor="portNumber" className="block text-grey-darker text-sm font-bold mb-2">
            Port Number
          </label>
          <select
            id="portNumber"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            value={selectedPortNumber}
            onChange={handlePortNumberChange}
          >

            {portNumbers.map((portNumber, index) => (
              <option key={index} value={portNumber}>
                {portNumber}
              </option>
            ))}
          </select>
        </div>
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
        <div className="mb-6">
          <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="email">
            Commission
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="Commission"
            type="number"
            disabled

          />   </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() => submitchange()}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
