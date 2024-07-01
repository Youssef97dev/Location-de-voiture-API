import prisma from "@/lib/prisma";

export const createReservation = async (
  userId: number,
  carId: number,
  startDate: Date,
  endDate: Date
) => {
  // Check car availability
  const overlappingReservations = await prisma.reservation.findMany({
    where: {
      id: carId,
      AND: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
    },
  });

  if (overlappingReservations.length > 0) {
    //throw new Error("Car is already reserved for the selected dates");
    return;
  }

  return await prisma.reservation.create({
    data: {
      userId,
      carId,
      startDate,
      endDate,
      status: "Confirmed",
    },
  });
};
