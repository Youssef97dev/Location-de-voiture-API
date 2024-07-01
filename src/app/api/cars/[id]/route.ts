import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { getCarById } from "@/services/carService";

type Params = {
  id: string;
};

export async function GET(req: Request, context: { params: Params }) {
  try {
    const carId = context.params.id;

    if (!carId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing carId" }),
        { status: 400 }
      );
    }

    const car = await getCarById(Number(carId));
    if (!car) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ car }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
