import { NextResponse } from "next/server";
import { getUserReservations } from "@/services/userService";

type Params = {
  id: string;
};

export const GET = async (req: Request, context: { params: Params }) => {
  try {
    const id = context.params.id;

    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const reservations = await getUserReservations(Number(id));
    if (!reservations) {
      return NextResponse.json(
        { message: "Reservations not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
