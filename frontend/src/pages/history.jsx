import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../component/authContext";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
function HistoryPage() {
  const { authToken } = useContext(AuthContext);
  const [ports, setPorts] = useState([]);
  const [selectedPortId, setSelectedPortId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(1);
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await axios.get(
            "http://localhost:8800/api/user/fetchUserData",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        setPorts(response.data.userData.ports || []);
        console.log(response)
      } catch (error) {
        console.error('Error fetching ports:', error);
      }
    };

    if (authToken) {
      fetchPorts();
    }
  }, [authToken]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedPortId) {
        setTransactions([]);
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8800/api/user/history/${selectedPortId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setTransactions(response.data.transactions);
        setNoData(response.data.transactions.length === 0);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTransactions();
  }, [selectedPortId, authToken]);
  useEffect(() => {
    // Update the number of pages
    setNoOfPages(Math.ceil(transactions.length / itemsPerPage));
  }, [transactions]);
  const getStatusLabel = (status) => {
    switch(status) {
      case '0': return 'Not Pay';
      case '1': return 'Complete';
      case '2': return 'Reject';
      case '3': return 'Pending';
      default: return 'Unknown'; 
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case '0':
      case '2':
        return 'text-red-600'; // red for 'Not Pay' and 'Reject'
      case '1':
        return 'text-green-600'; // green for 'Complete'
      case '3':
        return 'text-orange-600'; // orange for 'Pending'
      default:
        return 'text-gray-600'; // default color
    }
  };
  const currentTransactions = transactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
<div className="container mx-auto p-4">
  <h1 className="text-2xl font-semibold text-center mb-6">Transaction History</h1>
  <div className="flex justify-center mb-4">
    <select 
      value={selectedPortId} 
      onChange={e => setSelectedPortId(e.target.value)}
      className="form-select block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    >
      <option value="">Select a Port</option>
      {ports.map(port => (
        <option key={port.id} value={port.id}>{port.port_number}</option>
      ))}
    </select>
  </div>

  {isLoading ? (
    <div className="text-center">
      <p>Loading transactions...</p>
    </div>
  ) : noData ? (
    <div className="text-center">
      <p>No transactions found for the selected port.</p>
    </div>
  ) : (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">Date</th>
            <th scope="col" className="py-3 px-6">Profit</th>
            <th scope="col" className="py-3 px-6">Commission</th>
            <th scope="col" className="py-3 px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map(transaction => (
            <tr key={transaction.Transaction_ID} className="bg-white border-b hover:bg-gray-50">
              <td className="py-4 px-6">{new Date(transaction.Date).toLocaleDateString()}</td>
              <td className="py-4 px-6">{transaction.Profit.toFixed(2)}</td>
              <td className="py-4 px-6">{transaction.Commission.toFixed(2)}</td>
              <td className={`py-4 px-6 ${getStatusClass(transaction.Status)}`}>{getStatusLabel(transaction.Status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" mt={2}>
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handlePageChange}
          defaultPage={1}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={{ my: 2 }}
        />
      </Stack>
    </div>
  )}
</div>


  );
}

export default HistoryPage;
