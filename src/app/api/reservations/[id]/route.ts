import { NextResponse } from "next/server";

import { updateReservation } from "@/services/reservation-service";
import type { Error } from "@/types/error";
import type { Reservation } from "@/types/reservation";

interface Params {
  id: string;
}

export async function PUT(req: Request, context: { params: Params }) {
  try {
    const reservationId = Number(context.params.id);

    if (!reservationId) {
      return NextResponse.json(
        { message: "Invalid or missing ReservationId" },
        { status: 400 }
      );
    }

    const { userId, carId, startDate, endDate, status } =
      (await req.json()) as Reservation;

    const reservation: Reservation = await updateReservation(
      Number(reservationId),
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
}
