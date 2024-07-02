import { NextResponse } from "next/server";
import { updateReservation } from "@/services/reservationService";
import { Reservation } from "@/types/Reservation";

type Params = {
  id: string;
};

export async function PUT(req: Request, context: { params: Params }) {
  try {
    const reservationId: number = Number(context.params.id);

    if (!reservationId) {
      return NextResponse.json(
        { message: "Invalid or missing ReservationId" },
        { status: 400 }
      );
    }

    const { userId, carId, startDate, endDate, status } = await req.json();

    const reservation: Reservation = await updateReservation(
      Number(reservationId),
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
}
