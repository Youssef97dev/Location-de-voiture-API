"use client";

import useSWR from "swr";
import axios from "axios";

import { CiCircleMore } from "react-icons/ci";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const CarList = () => {
  const { data, error } = useSWR("/api/cars", fetcher);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-left">Cars</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200">Brand</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Model</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Year</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Detail</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((car: any) => (
              <tr key={car.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{car.brand}</td>
                <td className="px-4 py-2 border-b">{car.model}</td>
                <td className="px-4 py-2 border-b">{car.year}</td>
                <td className="px-4 py-2 border-b">
                  <CiCircleMore size={27} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList;
