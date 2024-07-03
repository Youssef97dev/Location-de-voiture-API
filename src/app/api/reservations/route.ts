import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { createReservation } from "@/services/reservation-service";
import type { Error } from "@/types/error";
import type { Reservation } from "@/types/reservation";

export const POST = async (req: NextRequest) => {
  const { carId, startDate, endDate, status } =
    (await req.json()) as Reservation;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = Number(token?.sub);
  try {
    const reservation: Reservation = await createReservation(
      userId,
      carId,
      new Date(startDate),
      new Date(endDate),
      status
    );
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
