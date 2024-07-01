import prisma from "@/lib/prisma";

export const getUserReservations = async (userId: number) => {
  return await prisma.reservation.findMany({
    where: { userId },
    include: { car: true },
  });
};
