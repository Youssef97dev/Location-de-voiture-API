import { NextResponse } from "next/server";
import { getReservationsDuration } from "@/services/reservationService";
import { Duration } from "@/types/Reservation";

export const GET = async () => {
  try {
    const reservationsDuration: Duration[] = await getReservationsDuration();
    return NextResponse.json({ reservationsDuration }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting reservation duration", error },
      { status: 500 }
    );
  }
};
