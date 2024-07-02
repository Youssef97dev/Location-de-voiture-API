import { NextResponse } from "next/server";
import { getUserReservationsSummary } from "@/services/userService";
import { Summary } from "@/types/Reservation";

export const GET = async () => {
  try {
    const reservationsSummary: Summary[] = await getUserReservationsSummary();
    return await NextResponse.json({ reservationsSummary }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting reservations summary", error },
      { status: 500 }
    );
  }
};
