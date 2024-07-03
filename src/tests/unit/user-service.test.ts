import { prisma } from "@/lib/prisma";
import {
  getUserReservations,
  getUserReservationsSummary,
} from "@/services/user-service";

// Mock Prisma Client
jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    prisma: {
      reservation: {
        findMany: jest.fn(),
      },
      $queryRaw: jest.fn(),
    },
  };
});

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserReservations", () => {
    test("should get user reservations", async () => {
      const mockReservations = [
        {
          id: 1,
          carId: 1,
          startDate: new Date("2023-06-01"),
          endDate: new Date("2023-06-05"),
          status: "confirmed",
          car: {
            id: 1,
            brand: "Toyota",
            model: "Corolla",
            year: 2020,
            available: true,
          },
        },
        {
          id: 2,
          carId: 2,
          startDate: new Date("2023-06-10"),
          endDate: new Date("2023-06-15"),
          status: "confirmed",
          car: {
            id: 2,
            brand: "Honda",
            model: "Civic",
            year: 2019,
            available: true,
          },
        },
      ];

      (prisma.reservation.findMany as jest.Mock).mockResolvedValue(
        mockReservations
      );

      const reservations = await getUserReservations(1);

      expect(reservations).toEqual(mockReservations);
      const findManyMock = jest
        .spyOn(prisma.reservation, "findMany")
        .mockResolvedValue([]);

      expect(findManyMock).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { car: true },
      });

      findManyMock.mockRestore();
    });

    test("should throw an error if getUserReservations fails", async () => {
      (prisma.reservation.findMany as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(getUserReservations(1)).rejects.toThrow("DB error");
    });
  });

  describe("getUserReservationsSummary", () => {
    test("should get user reservations summary", async () => {
      const mockSummary = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          totalReservations: 2,
          totalDuration: 10,
        },
      ];

      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockSummary);

      const summary = await getUserReservationsSummary();

      expect(summary).toEqual(mockSummary);
    });

    test("should throw an error if getUserReservationsSummary fails", async () => {
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(getUserReservationsSummary()).rejects.toThrow("DB error");
    });
  });
});
