import { NextResponse } from "next/server";

import { getCarById } from "@/services/car-service";
import type { Car } from "@/types/car";

interface Params {
  id: string;
}

export async function GET(req: Request, context: { params: Params }) {
  try {
    const carId = Number(context.params.id);

    if (!carId) {
      return NextResponse.json(
        { message: "Invalid or missing carId" },
        { status: 400 }
      );
    }

    const car: Car | null = await getCarById(Number(carId));
    if (!car) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting car", error },
      { status: 500 }
    );
  }
}
