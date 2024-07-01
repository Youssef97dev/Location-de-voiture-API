import { NextResponse } from "next/server";
import { createReservation } from "@/services/reservationService";
import { getToken } from "next-auth/jwt";

export const POST = async (req: any) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { carId, startDate, endDate } = await req.json();

  try {
    const reservation = await createReservation(
      Number(token?.sub),
      carId,
      new Date(startDate),
      new Date(endDate)
    );
    if (!reservation) {
      return NextResponse.json(
        { message: "Car is already reserved for the selected dates" },
        { status: 409 }
      );
    }
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating reservation", error },
      { status: 500 }
    );
  }
};
