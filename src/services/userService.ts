import prisma from "@/lib/prisma";
import { Summary } from "@/types/Reservation";

export const getUserReservations = async (userId: number) => {
  return await prisma.reservation.findMany({
    where: { userId },
    include: { car: true },
  });
};

export const getUserReservationsSummary = async () => {
  const reservationsSummary: Summary[] = await prisma.$queryRaw`
  SELECT u.id,
         u."firstName",
         u."lastName",
         CAST(COUNT(r.id) as Int) AS totalReservations,
         SUM(DATE_PART('day', "endDate"::timestamp - "startDate"::timestamp)) AS totalDuration
  FROM "User" u JOIN "Reservation" r ON u.id = r."userId"
  GROUP BY u.id
    `;

  return reservationsSummary;
};
