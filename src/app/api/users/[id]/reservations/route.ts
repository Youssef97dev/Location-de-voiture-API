import { NextResponse } from "next/server";

import { getUserReservations } from "@/services/user-service";
import type { Reservation } from "@/types/reservation";

interface Params {
  id: string;
}

export const GET = async (req: Request, context: { params: Params }) => {
  try {
    const userId = Number(context.params.id);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const reservations: Reservation[] = await getUserReservations(userId);
    if (reservations.length <= 0) {
      return NextResponse.json(
        { message: "Reservations not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting user reservations", error },
      { status: 500 }
    );
  }
};
