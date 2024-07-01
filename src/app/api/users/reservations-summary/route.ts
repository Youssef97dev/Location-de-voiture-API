import { NextResponse } from "next/server";
import { getUserReservationsSummary } from "@/services/userService";

export const GET = async (req: Request, res: Response) => {
  try {
    const reservationsSummary = await getUserReservationsSummary();
    return await NextResponse.json({ reservationsSummary }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
  }
};
