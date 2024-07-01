import { NextResponse } from "next/server";
import { createReservation } from "@/services/reservationService";
import { getSession } from "next-auth/react";

export const POST = async (req: any) => {
  const session = await getSession({ req });
  const { carId, startDate, endDate, status } = await req.json();

  try {
    const reservation = await createReservation(
      Number(session?.user.id),
      carId,
      new Date(startDate),
      new Date(endDate),
      status
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
