import { NextResponse } from "next/server";
import { getAvailableCars } from "@/services/carService";
import { Car } from "@/types/Car";

export const GET = async () => {
  try {
    const cars: Car[] | null = await getAvailableCars();
    return NextResponse.json({ cars }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting available cars", error },
      { status: 500 }
    );
  }
};
