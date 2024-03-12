import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
function Comdetail() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const { port } = location.state || {};
  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8800/api/admin/fetchcommissiondetail`,
          {
            port: port,
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching commission data:", error);
      }
    };
    fetchCommission();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow overflow-y-auto relative">
            <p className=" text-lg font-bold">User Commission {port}</p>
          <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
            <thead>
              <tr className="text-center bg-green-500">
                <th className="border px-4 py-2 text-white ">
                  Transaction_num
                </th>
                <th className="border px-4 py-2 text-white">Date</th>
                <th className="border px-4 py-2 text-white">Commission</th>
                <th className="border px-4 py-2 text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.Date}</td>
                  <td className="border px-4 py-2">{item.Commission}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`font-bold py-1 px-3 rounded ${
                        item.Status === "0"
                          ? "text-yellow-600"
                          : item.Status === "1"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {item.Status === "0"
                        ? "รอดำเนินการ"
                        : item.Status === "1"
                        ? "ชำระแล้ว"
                        : "ยังไม่ชำระ"}
                    </span>
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

export default Comdetail;
