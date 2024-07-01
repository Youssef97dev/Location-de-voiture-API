import { NextResponse } from "next/server";
import { getReservationsDuration } from "@/services/reservationService";

export const GET = async (req: Request, res: Response) => {
  try {
    const reservationsDuration = await getReservationsDuration();
    return NextResponse.json({ reservationsDuration }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
