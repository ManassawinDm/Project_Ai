import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Commission() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/fetchcommission`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching commission data:', error);
      }
    };
    fetchCommission();
  }, []);

  const handleDetail=(port)=>{
    navigate("/admin/comdetail",{state:{port:port}})
  }

  const handleImageClick = (filePath) => {
    setCurrentImage(filePath);
    setIsModalOpen(true);
  };

  // Assuming handleVerify and handleReject are already defined somewhere
  // If not, you need to define these functions based on what they are supposed to do

  return (
    <div className="container mx-auto mt-8 text-white">
      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow overflow-y-auto relative">
          <table className="table-auto w-full whitespace-no-wrap bg-[#1a222c] table-striped relative">
            <thead>
              <tr className="text-center bg-[#313d4a]">
                <th className="px-4 py-2 text-[#00df9a] ">Email</th>
                <th className="px-4 py-2 text-[#00df9a]">Port Number</th>
                <th className="px-4 py-2 text-[#00df9a]">Total Commission</th>
                <th className="px-4 py-2 text-[#00df9a]">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item,index) => (
                <tr key={index} className="text-center ">
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{item.port_number}</td>
                  <td className="px-4 py-2">{item.totalCommission}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={()=>handleDetail(item.port_number)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">No commission data found.</div>
      )}
    </div>
  );
}

export default Commission;
