import prisma from "@/lib/prisma";

export const getAvailableCars = async () => {
  return await prisma.car.findMany({
    where: {
      available: true,
    },
  });
};

export const getCarById = async (id: number) => {
  return await prisma.car.findUnique({
    where: { id },
  });
};
