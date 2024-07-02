import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { User } from "@/types/User";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, adresse, phoneNumber } =
      await req.json();

    // Hash password
    const hashedPassword: string = await hashPassword(password);

    const newUser: User = await prisma.user.create({
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
    return NextResponse.json(
      { message: "Error creating user", error },
      { status: 500 }
    );
  }
}
