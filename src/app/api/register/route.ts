import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: any) {
  try {
    console.log("req body:", req.body);
    const { email, password, firstName, lastName, adresse, phoneNumber } =
      await req.json();

    // Hash password
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        adresse,
        phoneNumber,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
