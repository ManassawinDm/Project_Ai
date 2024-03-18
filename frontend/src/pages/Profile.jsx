import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../component/authContext";
import axios from "axios";
import Script from "react-load-script";
import {
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

let OmiseCard;

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error', etc.
  const [anyTransactionLocked, setAnyTransactionLocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [authorizeUri, setAuthorizeUri] = useState('');


  const calculateTotalCommission = () => {
    const totalCommissionInBaht = selectedTransactions.reduce(
      (total, transactionId) => {
        const transaction = transactions.find(
          (t) => t.Transaction_ID === transactionId
        );
        return total + parseFloat(transaction?.Commission || 0);
      },
      0
    );
    return totalCommissionInBaht;
  };

  const calculateTotalCommissionforOmise = () => {
    const totalCommissionInBaht = selectedTransactions.reduce(
      (total, transactionId) => {
        const transaction = transactions.find(
          (t) => t.Transaction_ID === transactionId
        );
        return total + parseFloat(transaction?.Commission || 0);
      },
      0
    );
    // Multiply by 100 to convert to the smallest currency unit and round to nearest integer
    return Math.round(totalCommissionInBaht * 100);
  };

  const handlePayqrcode = (e) => {
    e.preventDefault();

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

  const handlePay = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    creditCardConfigure();
    omiseCardHandler();
  };

  const handlePaybank = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    bankConfigure();
    omisebankHandler();
  };

  const handlePromptPay = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    promtpayConfigure()
    omisepromtpayHandler();
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
        `http://localhost:8112/api/user/transactions/${portId}`
      );
      const transactionsWithLockInfo = response.data.transactions.map(
        (transaction) => {
          const transactionDate = new Date(transaction.Date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          // Mark the transaction as 'locked' if it's older than 1 month
          return {
            ...transaction,
            locked: transactionDate < oneMonthAgo,
          };
        }
      );

      // Check if any transactions are locked
      const anyLocked = transactionsWithLockInfo.some((t) => t.locked);
      setAnyTransactionLocked(anyLocked); // Update state based on if any transactions are locked

      if (anyLocked) {
        setSelectedTransactions(
          transactionsWithLockInfo.map((t) => t.Transaction_ID)
        );
      }

      setTransactions(transactionsWithLockInfo);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleTransactionSelectionChange = (transactionId) => {
    // Prevent changing selection of locked transactions
    const transaction = transactions.find(
      (t) => t.Transaction_ID === transactionId
    );
    if (transaction && transaction.locked) return; // Do nothing if transaction is locked

    setSelectedTransactions((prevSelected) => {
      if (prevSelected.includes(transactionId)) {
        return prevSelected.filter((id) => id !== transactionId);
      } else {
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
        "http://localhost:8112/api/user/addPort",
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

      await axios.post("http://localhost:8112/api/file/upload/port", formData, {
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
          "http://localhost:8112/api/user/fetchUserData",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setuserEmail(response.data.userData.email);
        const portsDataFromResponse = response.data.userData.ports;
        setPortsData(portsDataFromResponse);
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
  }, [authToken, snackbarSeverity, snackbarMessage, openSnackbar, open]);

  const getStatusSymbol = (status) => {
    switch (status) {
      case 0:
        return "⏳";
      case 1:
        return "✅";
    }
  };
  const handleSelectAllTransactions = (event) => {
    event.preventDefault();
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(
        transactions
          .filter((t) => !t.locked || t.locked)
          .map((t) => t.Transaction_ID)
      );
    }
  };

  /*{Omise}*/
  const handleLoadScript = () => {
    OmiseCard = window.OmiseCard;
    OmiseCard.configure({
      publicKey: import.meta.env.VITE_REACT_APP_OMISE_PUBLIC_KEY,
      currency: "THB",
      frameLabel: "Trading Bot",
      submitLabel: "Pay NOW",
      buttonLabel: "Pay with Omise",
    });
  };

  const creditCardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: "credit_card",
      otherPaymentMethods: [],
    });
    OmiseCard.configureButton("#credit-card");
    OmiseCard.attach();
  };

  const omiseCardHandler = () => {
    const selectedPortData = portsData.find(
      (port) => port.port_number === selectedPortNumber
    );
    OmiseCard.open({
      amount: calculateTotalCommissionforOmise(),
      onCreateTokenSuccess: (token) => {
        axios
          .post("http://localhost:8112/api/omise/payment", {
            email: userEmail,
            amount: calculateTotalCommissionforOmise(),
            port_id: selectedPortData.port_id,
            selectedTransactions: selectedTransactions,
            token: token,
          })
          .then((response) => {
            setOpenSnackbar(true);
            setSnackbarMessage("Payment successful");
            setSnackbarSeverity("success");
          })
          .catch((error) => {
            setOpenSnackbar(true);
            setSnackbarMessage("Payment failed");
            setSnackbarSeverity("error", error);
          });
      },
      onFormClosed: () => {},
    });
  };

  const bankConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: "internet_banking",
      otherPaymentMethods: [
        "mobile_banking_bay",
        "mobile_banking_bbl",
        "mobile_banking_kbank",
        "mobile_banking_ktb",
        "mobile_banking_scb",
      ],
    });
    OmiseCard.configureButton("#internet-bank");
    OmiseCard.attach();
  };

  const omisebankHandler = () => {
    OmiseCard.open({
      amount: calculateTotalCommissionforOmise(),
      onCreateTokenSuccess: async (token) => {
        try {
          const response = await axios.post(
            "http://localhost:8112/api/omise/paymentBank",
            {
              email: userEmail,
              amount: calculateTotalCommissionforOmise(),
              selectedTransactions: selectedTransactions,
              token: token,
            }
          );

          const { authorizeUri } = response.data;
          if (authorizeUri) {
            window.location.href = authorizeUri;
          }
        } catch (error) {
          setOpenSnackbar(true);
          setSnackbarMessage("Payment failed");
          setSnackbarSeverity("error");
        }
      },
      onFormClosed: () => {},
    });
  };

  const promtpayConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: "promptpay",
    });
    OmiseCard.configureButton("#internet-bank");
    OmiseCard.attach();
  };

  const omisepromtpayHandler = () => {
    OmiseCard.open({
      amount: calculateTotalCommissionforOmise(),
      onCreateTokenSuccess: async (token) => {
        try {
          const response = await axios.post(
            "http://localhost:8112/api/omise/paymentpromtpay",
            {
              amount: calculateTotalCommissionforOmise(),
              selectedTransactions: selectedTransactions,
              token: token,
            }
          );
          const { authorizeUri } = response.data;
          if (authorizeUri) {
            setAuthorizeUri(authorizeUri);
            setIsPopupOpen(true); // Open the popup
          }
        } catch (error) {
          setOpenSnackbar(true);
          setSnackbarMessage("Payment failed");
          setSnackbarSeverity("error");
        }
      },
      onFormClosed: () => {},
    });
  };

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8112/api/omise/getstatus"
        );
        console.log(response);
        const { status, amount } = response.data.slipData;

        if (status) {
          setStatusMessage(status === "successful" ? "Successful" : "Failed");
          setAmount(amount / 100);
          setOpen(true);
        }
      } catch (err) {
        console.log(err);
        setStatusMessage("Failed to retrieve status");
        setOpen(true);
      }
    };
    getStatus();
  }, []);

  const handleresetStatus = async () => {
    try {
      await axios.post("http://localhost:8112/api/omise/setstatus", {});
    } catch (error) {
      console.error("Error verifying", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    handleresetStatus();
  };

  const Popup = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;
  
    // ปรับปรุงฟังก์ชัน onClose ที่นี่
    const handleClose = () => {
      onClose(); // เรียกใช้งาน onClose ที่ผ่านมาจาก props หากมีการจัดการเพิ่มเติมในนั้น
      window.location.reload(); // Refresh หน้าเว็บ
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md max-h-[35vh] w-full overflow-auto">
          <div className="flex justify-end p-2">
            <button onClick={handleClose} className="text-black text-xl">
              &times; Close
            </button>
          </div>
          <img src={imageUrl} alt="Authorization" className="max-w-full max-h-[30vh] mx-auto p-4" />
        </div>
      </div>
    );
  };
  
  
  
  

  return (
    <div className="flex flex-col items-center p-4 mt-8 text-white">
       <Popup
      isOpen={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
      imageUrl={authorizeUri}
    />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            fontSize: "1.1rem",
            "& .MuiAlert-icon": {
              fontSize: "2rem",
            },
            boxShadow: 3,
            bgcolor:
              snackbarSeverity === "success" ? "limegreen" : "error.main",
            color: "white",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {statusMessage && (
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "#f0f0f0",
              minWidth: "30%",
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: "#00df9a", color: "#ffffff" }}>
            Payment Status
          </DialogTitle>
          <DialogContent>
            <Typography
              variant="h6"
              component="p"
              sx={{ color: "#333", marginBottom: "16px" }}
            >
              Amount: {amount} THB
            </Typography>
            <DialogContentText>
              <Typography
                variant="body1"
                component="p"
                sx={{
                  color: statusMessage === "Successful" ? "#4caf50" : "#f44336",
                  fontSize: "1.25rem",
                }}
              >
                {statusMessage}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                backgroundColor: "#00df9a",
                "&:hover": { backgroundColor: "#00b386" },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
       
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
              <Script
                url="https://cdn.omise.co/omise.js"
                onLoad={handleLoadScript}
              />
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
                      <tr
                        key={transaction.Transaction_ID}
                        className="border-b border-[#00df9a]"
                      >
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
                            disabled={transaction.locked} // Disable checkbox if transaction is locked
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Total Commission:
                  </h3>
                  <p className="text-xl font-bold text-white">
                    ฿{calculateTotalCommission().toFixed(2)}
                  </p>
                </div>
                {!anyTransactionLocked && (
                  <button
                    onClick={handleSelectAllTransactions}
                    className="px-4 py-2 bg-[#00df9a] text-[#133f31] rounded hover:bg-[#44967c] transition-colors duration-300"
                  >
                    Select All
                  </button>
                )}
              </div>
              {selectionError && (
                <div className="text-red-500 text-center mt-2 mb-2">
                  {selectionError}
                </div>
              )}
              <button
                id="credit-card"
                type="button"
                onClick={handlePay}
                disabled={calculateTotalCommission() <= 20}
                className={`w-full text-[#133f31] py-3 rounded-lg transition duration-300 ease-in-out ${
                  calculateTotalCommission() <= 20
                    ? "bg-[#44967c] opacity-50 cursor-not-allowed"
                    : "bg-[#00df9a] hover:bg-[#44967c]"
                }`}
              >
                {calculateTotalCommission() <= 20
                  ? "Must pay a minimum of 20฿"
                  : "Pay With Credit Card"}
              </button>
              <button
                id="internet-bank"
                type="button"
                onClick={handlePaybank}
                disabled={calculateTotalCommission() <= 20}
                className={`w-full text-[#133f31] py-3 rounded-lg transition duration-300 ease-in-out ${
                  calculateTotalCommission() <= 20
                    ? "bg-[#44967c] opacity-50 cursor-not-allowed"
                    : "bg-[#00df9a] hover:bg-[#44967c]"
                }`}
              >
                {calculateTotalCommission() <= 20
                  ? "Must pay a minimum of 20฿"
                  : "Pay with Bank"}
              </button>
              <button
                id="promptpay"
                type="button"
                onClick={handlePromptPay}
                disabled={calculateTotalCommission() <= 20}
                className={`w-full text-[#133f31] py-3 rounded-lg transition duration-300 ease-in-out ${
                  calculateTotalCommission() <= 20
                    ? "bg-[#44967c] opacity-50 cursor-not-allowed"
                    : "bg-[#00df9a] hover:bg-[#44967c]"
                }`}
              >
                {calculateTotalCommission() <= 20
                  ? "Must pay a minimum of 20฿"
                  : "Pay with PromptPay"}
              </button>
              <button
                type="button" // Change to 'button' to prevent it from submitting a form
                onClick={handlePayqrcode}
                className="w-full bg-[#00df9a] text-[#133f31] py-3 rounded-lg hover:bg-[#44967c] transition duration-300 ease-in-out"
              >
                Pay with qrcode
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
