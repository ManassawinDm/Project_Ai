import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Payment() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleImageClick = (imagePath) => {
    setCurrentImage(imagePath);
    setIsModalOpen(true);
  };

  const ImageModal = ({ isOpen, close, image }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" style={{ animation: 'fadeIn 0.3s' }}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ maxWidth: '80vw', maxHeight: '80vh', transform: 'scale(1)', animation: 'scaleIn 0.3s' }}>
          <div className="flex justify-center items-center p-4" style={{ height: '75vh' }}>
            <img src={image} alt="Full Size" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div className="text-right p-2">
            <button
              className="inline-block text-lg px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none transition duration-150 ease-in-out"
              onClick={close}
            >
              Close
            </button>
          </div>
        </div>
      </div>


    );
  };

  const handleVerify = async (slipId, transactions) => {
    try {
      const response = await axios.post('http://localhost:8800/api/admin/approveSlip', { transactionIds: transactions });
      console.log('Verified:', response.data);
      await axios.delete(`http://localhost:8800/api/admin/deleteSlip/${slipId}`);
      setSlips(currentSlips => currentSlips.filter(slip => slip.uploadslip_id.toString() !== slipId.toString()));
    } catch (error) {
      console.error('Error verifying transactions:', error);
    }
  };

  const handleReject = async (slipId, transactions) => {
    try {
      const response = await axios.post('http://localhost:8800/api/admin/rejectSlip', { transactionIds: transactions });
      console.log('Rejected:', response.data);
      await axios.delete(`http://localhost:8800/api/admin/deleteSlip/${slipId}`);
      setSlips(currentSlips => currentSlips.filter(slip => slip.uploadslip_id.toString() !== slipId.toString()));
    } catch (error) {
      console.error('Error rejecting transactions:', error);
    }
  };


  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/admin/slips');
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
    <div className="container mx-auto mt-8">
      <ImageModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        image={`http://localhost:8800/${currentImage}`}
      />
      <h2 className="text-xl font-semibold mb-6 text-center">Payment Slips</h2>
      {slips.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow overflow-y-auto relative">
          <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
            <thead>
              <tr className="text-center bg-green-100">
                <th className="border px-4 py-2 text-green-600">Name</th>
                <th className="border px-4 py-2 text-green-600">Photo</th>
                <th className="border px-4 py-2 text-green-600">Check</th>
              </tr>
            </thead>
            <tbody>
              {slips.map((slip) => (
                <tr key={slip.id} className="text-center border-b">
                  <td className="border px-4 py-2">{slip.name}</td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center">
                      <img
                        src={`http://localhost:8800/${slip.filePath}`}
                        alt="Payment Slip"
                        style={{ width: 'auto', height: '100px' }}
                        className="cursor-pointer"
                        onClick={() => handleImageClick(slip.filePath)}
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2">
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
        </div>
      ) : (
        <div className="text-center">No payment slips found.</div>
      )}
    </div>

  );
}

export default Payment;
