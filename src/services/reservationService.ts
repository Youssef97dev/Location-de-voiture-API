import prisma from "@/lib/prisma";
import { Duration, Reservation } from "@/types/Reservation";

export const createReservation = async (
  userId: number,
  carId: number,
  startDate: Date,
  endDate: Date,
  status: string
) => {
  // Check date order
  if (endDate < startDate) {
    throw new Error("The end date must not precede the start date");
  }

  // Check car availability
  const overlappingReservations: Reservation[] =
    await prisma.reservation.findMany({
      where: {
        carId,
        AND: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
      },
    });

  if (overlappingReservations.length > 0) {
    throw new Error("The car is not available for the selected dates");
  }

  return await prisma.reservation.create({
    data: {
      userId,
      carId,
      startDate,
      endDate,
      status,
    },
  });
};

export const updateReservation = async (
  id: number,
  userId: number,
  carId: number,
  startDate: Date,
  endDate: Date,
  status: string
) => {
  // Check reservation if exist
  const reservation: Reservation | null = await prisma.reservation.findUnique({
    where: { id },
  });
  if (!reservation) {
    throw new Error("Reservation not found");
  }

  // Check car availability
  const overlappingReservations: Reservation[] =
    await prisma.reservation.findMany({
      where: {
        carId,
        AND: [
          {
            id: { not: id },
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

  if (overlappingReservations.length > 0) {
    throw new Error("The car is not available for the selected dates");
  }

  return await prisma.reservation.update({
    where: { id },
    data: {
      userId,
      carId,
      startDate,
      endDate,
      status,
    },
  });
};

export const getReservationsDuration = async () => {
  const reservationsDuration: Duration[] = await prisma.$queryRaw`
      SELECT
      id,
      "startDate",
      "endDate",
      DATE_PART('day', "endDate"::timestamp - "startDate"::timestamp) AS duration
      FROM "Reservation"
    `;

  return reservationsDuration;
};
