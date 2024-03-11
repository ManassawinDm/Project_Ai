import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VerifyPort() {
  const [verifyData, setVerifyData] = useState([]);

  const handleVerify = async (id) => {
    // console.log(id)
    try {
      // Assuming you have an endpoint to update the status
      await axios.post(`http://localhost:8800/api/user/verify/${id}`, {
        status: '1'
      });
      setVerifyData(prevData => prevData.filter(data => data.id !== id));
    } catch (error) {
      console.error('Error verifying', error);
    }
  };

  const handleReject = async (id, file_id) => {
    // console.log(id)
    try {
      
      await axios.post(`http://localhost:8800/api/user/reject/${id}`, {
        file_id: file_id
      });
      setVerifyData(prevData => prevData.filter(data => data.id !== id));
    } catch (error) {
      console.error('Error rejecting', error);
    }
  };

  useEffect(() => {
    const fetchVerifyData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/user/check/port');
        setVerifyData(response.data);
        console.log(verifyData)
      } catch (error) {
        console.error('Error fetching verification data', error);
      }
    };

    fetchVerifyData();
  }, []);

  return (
    <div className="flex flex-col items-center my-8">
    <h2 className="text-2xl font-semibold mb-4">ยืนยันพอร์ตของ User</h2>
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-teal-500 text-white">
          <tr>
            <th className="py-2 hidden md:table-cell">E-mail</th>
            <th>Port Number</th>
            <th>Photo</th>
            <th>Check</th>
          </tr>
        </thead>
        <tbody>
          {verifyData.map((data, index) => (
            <tr className="border-b border-gray-200 text-center" key={data.id}>
              <td className="py-3 hidden md:table-cell">{data.accountEmail}</td>
              <td>{data.portNumber}</td>
              <td>
                <a href={`../public/${data.filepath}`} target="_blank" rel="noopener noreferrer">
                  <img src={`../public/${data.filepath}`} alt="Thumbnail" className="mx-auto h-12 w-auto"/>
                </a>
              </td>
              <td className="flex justify-center items-center">
                <div className="flex space-x-2">
                  <svg
                    onClick={() => handleVerify(data.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                    style={{ color:'green'}}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>

                  <svg
                    onClick={() => handleReject(data.id,data.file_id)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                    style={{ color:'red'}}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75l-5.25 5.25M9.75 9.75l5.25 5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default VerifyPort;
