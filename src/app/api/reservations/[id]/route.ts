import { NextResponse } from "next/server";
import { updateReservation } from "@/services/reservationService";
import Error from "next/error";

type Params = {
  id: string;
};

export async function PUT(req: Request, context: { params: Params }) {
  try {
    const reservationId = context.params.id;

    if (!reservationId) {
      return NextResponse.json(
        { message: "Invalid or missing Reservation Id" },
        { status: 400 }
      );
    }

    const { userId, carId, startDate, endDate, status } = await req.json();

    const reservation = await updateReservation(
      Number(reservationId),
      userId,
      carId,
      new Date(startDate),
      new Date(endDate),
      status
    );

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
