import { NextResponse } from "next/server";

import { getUserReservationsSummary } from "@/services/user-service";
import type { Summary } from "@/types/reservation";

export const GET = async () => {
  try {
    const reservationsSummary: Summary[] = await getUserReservationsSummary();
    return NextResponse.json(reservationsSummary, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting reservations summary", error },
      { status: 500 }
    );
  }
};
