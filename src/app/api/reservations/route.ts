import { NextResponse } from "next/server";
import { createReservation } from "@/services/reservationService";
import { getToken } from "next-auth/jwt";
import { Reservation } from "@/types/Reservation";

export const POST = async (req: any) => {
  const { carId, startDate, endDate, status } = await req.json();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId: number = Number(token?.sub);
  try {
    const reservation: Reservation = await createReservation(
      userId,
      carId,
      new Date(startDate),
      new Date(endDate),
      status
    );
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
