import prisma from "@/lib/prisma";

export const createReservation = async (
  userId: number,
  carId: number,
  startDate: Date,
  endDate: Date,
  status: string
) => {
  // Check car availability
  const overlappingReservations = await prisma.reservation.findMany({
    where: {
      id: carId,
      AND: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
    },
  });

  if (overlappingReservations.length > 0) {
    return;
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
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) {
    throw new Error("Reservation not found");
  }

  // Check car availability
  const overlappingReservations = await prisma.reservation.findMany({
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
