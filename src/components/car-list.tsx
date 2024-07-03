"use client";

import axios from "axios";
import useSWR from "swr";

// Type of car
import type { Car } from "@/types/car";
import type { Error } from "@/types/error";

const getAvailableCars = (url: string) =>
  axios.get(url).then((res) => res.data as Car[]);

const CarList = () => {
  const { data: cars, error } = useSWR<Car[], Error>(
    "/api/cars",
    getAvailableCars
  );
  if (error) return <div>Failed to load</div>;
  if (!cars) return <div>Loading...</div>;
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
              <th className="px-4 py-2 border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car: Car) => (
              <tr key={car.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{car.brand}</td>
                <td className="px-4 py-2 border-b">{car.model}</td>
                <td className="px-4 py-2 border-b">{car.year}</td>
                <td className="px-4 py-2 border-b flex space-x-3 text-white">
                  <button
                    className="px-4 py-2 bg-blue-700 rounded-md"
                    type="button"
                  >
                    Detail
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-700 rounded-md"
                    type="button"
                  >
                    Reserve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { CarList };
