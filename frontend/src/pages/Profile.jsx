import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../component/authContext";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [message, setmessage] = useState(null);
  const [userEmail, setuserEmail] = useState(null);
  const { authToken } = useContext(AuthContext);
  const [portNumbers, setPortNumbers] = useState([]); // Example port numbers
  const [selectedPortNumber, setSelectedPortNumber] = useState("");
  const [NewPort, setNewPort] = useState("");
  const [verificationImage, setVerificationImage] = useState(null);
  const [portId, setPortId] = useState(null);
  const [portStatus, setPortStatus] = useState(null);
  const [portsData, setPortsData] = useState([]);
  const [selectedPortCommission, setSelectedPortCommission] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [selectionError, setSelectionError] = useState("");

  const calculateTotalCommission = () => {
    return selectedTransactions.reduce((total, transactionId) => {
      // Assuming transactions array is the correct reference here
      const transaction = transactions.find(
        (t) => t.Transaction_ID === transactionId
      );
      return total + parseFloat(transaction?.Commission || 0);
    }, 0);
  };

  const handlePay = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedPortData = portsData.find(
      (port) => port.port_number === selectedPortNumber
    );
    if (!selectedTransactions.length) {
      // No transactions are selected, show an error message
      setSelectionError("Please select at least one transaction to proceed.");
      return; // Stop the function from proceeding further
    }

    if (selectedPortData) {
      navigate("/pay", {
        state: {
          port_id: selectedPortData.port_id,
          selectedTransactions: selectedTransactions,
          totalCommission: calculateTotalCommission(),
        },
      });
      setSelectionError(""); // Clear any previous error message
    } else {
      console.error("Selected port data not found.");
    }
  };

  const handleSelectPort = async (event) => {
    const portNumber = event.target.value;
    setSelectedPortNumber(portNumber);

    // Find the selected port data based on port number
    const selectedPortData = portsData.find(
      (port) => port.port_number === portNumber
    );

    if (selectedPortData) {
      // Fetch transactions for the selected port
      try {
        fetchTransactions(selectedPortData.port_id);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };
  const fetchTransactions = async (portId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/user/transactions/${portId}`
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleTransactionSelectionChange = (transactionId) => {
    setSelectedTransactions((prevSelected) => {
      // Check if the transaction ID is already selected
      if (prevSelected.includes(transactionId)) {
        // If it is, remove it from the array
        return prevSelected.filter((id) => id !== transactionId);
      } else {
        // If it's not selected, add it to the array
        return [...prevSelected, transactionId];
      }
    });
  };
  const handleVerificationImageChange = (event) => {
    setVerificationImage(event.target.files[0]); // Capture selected image
  };
  const handleAddPortChange = (event) => {
    setNewPort(event.target.value);
  };

  const submitchange = async () => {
    if (!NewPort || !verificationImage) {
      setmessage("Port ID and Verification Image are required.");
      return;
    }
    try {
      // Add port to the server
      const response = await axios.post(
        "http://localhost:8800/api/user/addPort",
        { portNumber: NewPort },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Assuming the server returns the newly added port ID
      const { portId } = response.data;

      // Update the state with the new port ID
      setPortId(portId);

      // Upload verification image for the added port
      const formData = new FormData();
      formData.append("verificationImage", verificationImage);
      formData.append("portId", portId);

      await axios.post("http://localhost:8800/api/file/upload/port", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(NewPort);
      const newPortData = {
        port_number: NewPort,
        status: 0,
      };
      setPortsData((prevPortsData) => [...prevPortsData, newPortData]);
      setNewPort("");
      setmessage("Port added successfully");
      setVerificationImage(null);
    } catch (error) {
      setmessage(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/user/fetchUserData",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setuserEmail(response.data.userData.email);
        const portsDataFromResponse = response.data.userData.ports; // Assuming ports data includes port number and status
        setPortsData(portsDataFromResponse);
        console.log(response.data.userData.ports);
        if (portsDataFromResponse.length > 0) {
          const initialPortNumber = portsDataFromResponse[0].port_number;
          const initialComission = portsDataFromResponse[0].total_commission;
          setSelectedPortNumber(initialPortNumber);
          setSelectedPortCommission(initialComission);
          setPortStatus(portsDataFromResponse[0].status);
          fetchTransactions(portsDataFromResponse[0].port_id);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (authToken) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const getStatusSymbol = (status) => {
    switch (status) {
      case 0:
        return "⏳";
      case 1:
        return "✅";
    }
  };
  const handleSelectAllTransactions = () => {
    event.preventDefault();
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map((t) => t.Transaction_ID));
    }
  };
  return (
    <div className="flex flex-col items-center p-4 mt-8 text-white">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className=" border border-[#0f1419] bg-[#1a222c] rounded-lg shadow-lg p-8 mb-4 md:mr-4 md:flex-grow">
            <div className="flex flex-col items-center pb-10"></div>
            <div className="space-y-6">
              <input
                className="w-full px-4 py-3 border border-[#0f1419] rounded-lg"
                type="email"
                placeholder={userEmail}
                disabled
              />

              <div className="mb-6">
                <label
                  className="block text-[#00df9a] text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Add port
                </label>
                <input
                  className="shadow appearance-none border border-[#0f1419] rounded w-full py-2 px-3 text-white r mb-3 bg-[#000300]"
                  id="add port"
                  type="text"
                  placeholder="add port number"
                  value={NewPort}
                  onChange={handleAddPortChange}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-[#00df9a] text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-[#00df9a] file:text-[#133f31]
               hover:file:bg-[#44967c]"
                  accept="image/*"
                  onChange={handleVerificationImageChange}
                />
              </div>
              {message === "Port added successfully" ? (
                <div className="flex items-start mb-6 text-green-700 justify-center">
                  {message}
                </div>
              ) : (
                <div className="flex items-start mb-6 text-red-700 justify-center">
                  {message}
                </div>
              )}
              <button
                className="w-full bg-[#00df9a] text-[#133f31] py-3 rounded-lg hover:bg-[#44967c] transition duration-300 ease-in-out"
                onClick={() => submitchange()}
              >
                Save changes
              </button>
            </div>
          </div>
          {/* New Form */}
          <div className=" border border-[#0f1419] bg-[#1a222c] rounded-lg shadow-lg p-8 md:flex-grow">
            <form className="space-y-6">
              <select
                id="portNumber"
                className="w-full px-4 py-3 border border-[#0b0f12] rounded-lg bg-[#0f1419] text-[#00df9a]"
                value={selectedPortNumber}
                onChange={handleSelectPort}
              >
                {portsData.map((port, index) => (
                  <option key={index} value={port.port_number}>
                    {`${getStatusSymbol(port.status)} ${port.port_number}`}{" "}
                    {/* Add status symbol next to port number */}
                  </option>
                ))}
              </select>

              <div>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-[#1a222c]">
                      <th className="px-2 md:px-4 py-2 text-left text-xs font-medium text-[#00df9a] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-2 md:px-4 py-2 text-left text-xs font-medium text-[#00df9a] uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-2 md:px-4 py-2 text-left text-xs font-medium text-[#00df9a] uppercase tracking-wider">
                        Select
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.Transaction_ID} className="border-b border-[#00df9a]">
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-white">
                          {new Date(transaction.Date).toLocaleDateString()}
                        </td>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-white">
                          ฿{transaction.Commission.toFixed(2)}
                        </td>
                        <td className="px-2 md:px-4 py-3 whitespace-nowrap text-white">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.includes(
                              transaction.Transaction_ID
                            )}
                            onChange={() =>
                              handleTransactionSelectionChange(
                                transaction.Transaction_ID
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Commission:</h3>
                  <p className="text-xl font-bold text-white">
                    ฿{calculateTotalCommission().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleSelectAllTransactions}
                  className="px-4 py-2 bg-[#00df9a] text-[#133f31] rounded hover:bg-[#44967c] transition-colors duration-300"
                >
                  Select All
                </button>
              </div>
              {selectionError && (
                <div className="text-red-500 text-center mt-2 mb-2">
                  {selectionError}
                </div>
              )}
              <button
                type="button" // Change to 'button' to prevent it from submitting a form
                onClick={handlePay}
                className="w-full bg-[#00df9a] text-[#133f31] py-3 rounded-lg hover:bg-[#44967c] transition duration-300 ease-in-out"
              >
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
