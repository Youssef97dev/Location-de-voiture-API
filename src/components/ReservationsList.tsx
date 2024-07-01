"use client";

import useSWR from "swr";
import axios from "axios";
import { useSession } from "next-auth/react";

const getUserReservations = (url: string) =>
  axios.get(url).then((res) => res.data);

const ReservationsList = () => {
  const { data: session } = useSession();
  const { data, error } = useSWR(
    session ? `/api/users/${session.user.id}/reservations` : null,
    getUserReservations
  );

  console.log(data.reservations.car);
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-left">Cars</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200">
                Car Brand
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200">
                Start Date
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200">End Date</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.reservations?.map((reservation: any) => (
              <tr key={reservation.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{reservation.car.brand}</td>
                <td className="px-4 py-2 border-b">{reservation.startDate}</td>
                <td className="px-4 py-2 border-b">{reservation.endDate}</td>
                <td className="px-4 py-2 border-b">{reservation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsList;
