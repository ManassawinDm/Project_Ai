import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Imageviewr from '../component/imageview';

function Payment() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleImageClick = (imagePath) => {
    setCurrentImage(imagePath);
    setIsModalOpen(true);
  };

  const handleVerify = async (slipId, transactions) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/approveSlip`, { transactionIds: transactions });
      console.log('Verified:', response.data);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/deleteSlip/${slipId}`);
      setSlips(currentSlips => currentSlips.filter(slip => slip.uploadslip_id.toString() !== slipId.toString()));
    } catch (error) {
      console.error('Error verifying transactions:', error);
    }
  };

  const handleReject = async (slipId, transactions) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/rejectSlip`, { transactionIds: transactions });
      console.log('Rejected:', response.data);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/deleteSlip/${slipId}`);
      setSlips(currentSlips => currentSlips.filter(slip => slip.uploadslip_id.toString() !== slipId.toString()));
    } catch (error) {
      console.error('Error rejecting transactions:', error);
    }
  };


  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/slips`);
        console.log(response.data)
        setSlips(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch slips:', error);
        setLoading(false);
      }
    };

    fetchSlips();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8 text-white">
      <h2 className="text-xl font-semibold mb-6 text-center text-[#00df9a]">Payment Slips</h2>
      {slips.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow overflow-y-auto relative">
          <table className=" table-auto w-full whitespace-no-wrap bg-[#1a222c] table-striped relative">
            <thead>
              <tr className="text-center bg-[#313d4a]">
                <th className=" px-4 py-2 text-[#00df9a]">Name</th>
                <th className="px-4 py-2 text-[#00df9a]">Photo</th>
                <th className="px-4 py-2 text-[#00df9a]">Check</th>
              </tr>
            </thead>
            <tbody>
              {slips.map((slip) => (
                <tr key={slip.id} className="text-center ">
                  <td className=" px-4 py-2">{slip.name}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${slip.filePath}`}
                        alt="Payment Slip"
                        style={{ width: 'auto', height: '100px' }}
                        className="cursor-pointer"
                        onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}/${slip.filePath}`)} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center space-x-2">
                      <svg
                        onClick={() => handleVerify(slip.uploadslip_id, slip.transactions)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10 cursor-pointer"
                        style={{ color: 'green' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>

                      <svg
                        onClick={() => handleReject(slip.uploadslip_id, slip.transactions)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10 cursor-pointer"
                        style={{ color: 'red' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75l-5.25 5.25M9.75 9.75l5.25 5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && <Imageviewr imageUrl={currentImage} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />}
        </div>
      ) : (
        <div className="text-center">No payment slips found.</div>
      )}
    </div>

  );
}

export default Payment;
