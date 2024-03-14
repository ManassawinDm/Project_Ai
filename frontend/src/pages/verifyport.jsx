import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Imageviewr from '../component/imageview';

function VerifyPort() {
  const [verifyData, setVerifyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleImageClick = (imagePath) => {
    setCurrentImage(imagePath);
    setIsModalOpen(true);
  };

  const handleVerify = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/verify/${id}`, { status: '1' });
      setVerifyData(prevData => prevData.filter(data => data.id !== id));
    } catch (error) {
      console.error('Error verifying', error);
    }
  };

  const handleReject = async (id, file_id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/reject/${id}`, { file_id: file_id });
      setVerifyData(prevData => prevData.filter(data => data.id !== id));
    } catch (error) {
      console.error('Error rejecting', error);
    }
  };

  useEffect(() => {
    const fetchVerifyData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/check/port`);
        setVerifyData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching verification data', error);
        setLoading(false);
      }
    };

    fetchVerifyData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <div className="container mx-auto mt-8 text-white">

      <h2 className="text-xl font-semibold mb-6 text-center text-[#00df9a]">Verify User Ports</h2>
      <div className="overflow-x-auto rounded-lg shadow overflow-y-auto relative ">
        <table className="w-full table-auto bg-[#1a222c]">
          <thead className="bg-[#313d4a] text-white">
            <tr>
              <th className="px-4 py-2 text-[#00df9a]">E-mail</th>
              <th className="px-4 py-2 text-[#00df9a]">Port Number</th>
              <th className="px-4 py-2 text-[#00df9a]">Photo</th>
              <th className="px-4 py-2 text-[#00df9a]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifyData.map(data => (
              <tr key={data.id} className=" border-gray-200 text-center">
                <td className="px-4 py-2">{data.accountEmail}</td>
                <td className="px-4 py-2">{data.portNumber}</td>
                <td className="px-4 py-2">
                  <img src={`${import.meta.env.VITE_API_URL}/${data.filepath}`} alt="Thumbnail" className="mx-auto cursor-pointer h-12 w-auto" onClick={() => handleImageClick(`${import.meta.env.VITE_API_URL}/${data.filepath}`)} />
                </td>
                <td className="px-4 py-2 flex justify-center items-center gap-4">
                  <button onClick={() => handleVerify(data.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Verify
                  </button>
                  <button onClick={() => handleReject(data.id, data.file_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && <Imageviewr imageUrl={currentImage} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
}

export default VerifyPort;
``
