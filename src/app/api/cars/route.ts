import { NextResponse } from "next/server";
import { getAvailableCars } from "@/services/carService";

export const GET = async (req: Request, res: Response) => {
  try {
    const cars = await getAvailableCars();
    return NextResponse.json({ data: cars }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
