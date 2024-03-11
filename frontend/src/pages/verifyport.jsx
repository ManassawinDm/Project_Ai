import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      await axios.post(`http://localhost:8800/api/user/verify/${id}`, { status: '1' });
      setVerifyData(prevData => prevData.filter(data => data.id !== id));
    } catch (error) {
      console.error('Error verifying', error);
    }
  };

  const handleReject = async (id, file_id) => {
    try {
      await axios.post(`http://localhost:8800/api/user/reject/${id}`, { file_id: file_id });
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

  const ImageModal = ({ isOpen, close, image }) => {
    if (!isOpen) return null;
    console.log(image)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded shadow p-4 max-w-lg max-h-full overflow-auto">
          <img src={image} alt="Port verification" className="w-full h-auto" />
          <div className="text-right mt-2">
            <button onClick={close} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition ease-in-out duration-150">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-8">
   <ImageModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        image={`${currentImage}`}
      />
      <h2 className="text-xl font-semibold mb-6 text-center">Verify User Ports</h2>
      <div className="overflow-x-auto rounded-lg shadow overflow-y-auto relative">
        <table className="w-full table-auto bg-white">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-4 py-2">E-mail</th>
              <th className="px-4 py-2">Port Number</th>
              <th className="px-4 py-2">Photo</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifyData.map(data => (
              <tr key={data.id} className="border-t border-gray-200 text-center">
                <td className="px-4 py-2">{data.accountEmail}</td>
                <td className="px-4 py-2">{data.portNumber}</td>
                <td className="px-4 py-2">
                  <img src={`http://localhost:8800/${data.filepath}`} alt="Thumbnail" className="mx-auto cursor-pointer h-12 w-auto" onClick={() => handleImageClick(`http://localhost:8800/${data.filepath}`)} />
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
      </div>
    </div>
  );
}

export default VerifyPort;
``
