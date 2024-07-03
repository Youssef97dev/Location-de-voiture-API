import { NextResponse } from "next/server";

import { getReservationsDuration } from "@/services/reservation-service";
import type { Duration } from "@/types/reservation";

export const GET = async () => {
  try {
    const reservationsDuration: Duration[] = await getReservationsDuration();
    return NextResponse.json(reservationsDuration, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting reservation duration", error },
      { status: 500 }
    );
  }
};
