import { prisma } from "@/lib/prisma";
import {
  createReservation,
  getReservationsDuration,
  updateReservation,
} from "@/services/reservation-service";

// Mock Prisma Client
jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    prisma: {
      reservation: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $queryRaw: jest.fn(),
    },
  };
});

describe("Reservation Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createReservation", () => {
    test("should create a reservation when no overlapping exists", async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        carId: 1,
        startDate: new Date("2023/06/01"),
        endDate: new Date("2023/06/05"),
        status: "confirmed",
      };

      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.reservation.create as jest.Mock).mockResolvedValue(
        mockReservation
      );

      const reservation = await createReservation(
        1,
        1,
        new Date("2023/06/01"),
        new Date("2023/06/05"),
        "confirmed"
      );

      expect(reservation).toEqual(mockReservation);
      const findManyMock = jest
        .spyOn(prisma.reservation, "findMany")
        .mockResolvedValue([]);

      expect(findManyMock).toHaveBeenCalledWith({
        where: {
          carId: 1,
          AND: [
            {
              startDate: { lte: new Date("2023/06/05") },
              endDate: { gte: new Date("2023/06/01") },
            },
          ],
        },
      });

      findManyMock.mockRestore();

      const createMock = jest
        .spyOn(prisma.reservation, "create")
        .mockResolvedValue({
          id: 1,
          userId: 1,
          carId: 1,
          startDate: new Date("2023/06/01"),
          endDate: new Date("2023/06/05"),
          status: "confirmed",
          updatedAt: new Date(),
          createdAt: new Date(),
        });

      expect(createMock).toHaveBeenCalledWith({
        data: {
          userId: 1,
          carId: 1,
          startDate: new Date("2023/06/01"),
          endDate: new Date("2023/06/05"),
          status: "confirmed",
        },
      });

      createMock.mockRestore();
    });

    test("should not create a reservation if overlapping exists", async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        carId: 1,
        startDate: new Date("2023/06/01"),
        endDate: new Date("2023/06/05"),
        status: "confirmed",
      };

      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
        mockReservation,
      ]);

      await expect(
        createReservation(
          1,
          1,
          new Date("2023/06/01"),
          new Date("2023/06/05"),
          "confirmed"
        )
      ).rejects.toThrow("The car is not available for the selected dates");

      const findManyMock = jest
        .spyOn(prisma.reservation, "findMany")
        .mockResolvedValue([]);

      expect(findManyMock).toHaveBeenCalledWith({
        where: {
          carId: 1,
          AND: [
            {
              startDate: { lte: new Date("2023/06/05") },
              endDate: { gte: new Date("2023/06/01") },
            },
          ],
        },
      });

      findManyMock.mockRestore();

      const createMock = jest
        .spyOn(prisma.reservation, "create")
        .mockResolvedValue({
          id: 1,
          userId: 1,
          carId: 1,
          startDate: new Date("2023/06/01"),
          endDate: new Date("2023/06/05"),
          status: "confirmed",
          updatedAt: new Date(),
          createdAt: new Date(),
        });

      expect(createMock).not.toHaveBeenCalledWith({
        data: {
          userId: 1,
          carId: 1,
          startDate: new Date("2023/06/01"),
          endDate: new Date("2023/06/05"),
          status: "confirmed",
        },
      });

      createMock.mockRestore();
    });

    test("should throw an error if createReservation fails", async () => {
      (prisma.reservation.findMany as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(
        createReservation(1, 1, new Date(), new Date(), "confirmed")
      ).rejects.toThrow("DB error");
    });
  });

  describe("updateReservation", () => {
    test("should update a reservation when no overlapping exists", async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        carId: 1,
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-06-05"),
        status: "confirmed",
      };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(
        mockReservation
      );
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.reservation.update as jest.Mock).mockResolvedValue(
        mockReservation
      );

      const reservation = await updateReservation(
        1,
        1,
        1,
        new Date("2023-06-01"),
        new Date("2023-06-05"),
        "confirmed"
      );

      expect(reservation).toEqual(mockReservation);

      const findUniqueMock = jest
        .spyOn(prisma.reservation, "findUnique")
        .mockResolvedValue(reservation);

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      findUniqueMock.mockRestore();

      const findManyMock = jest
        .spyOn(prisma.reservation, "findMany")
        .mockResolvedValue([]);

      expect(findManyMock).toHaveBeenCalledWith({
        where: {
          carId: 1,
          AND: [
            {
              id: { not: 1 },
              startDate: { lte: new Date("2023-06-05") },
              endDate: { gte: new Date("2023-06-01") },
            },
          ],
        },
      });

      findManyMock.mockRestore();

      const updateMock = jest
        .spyOn(prisma.reservation, "update")
        .mockResolvedValue(reservation);
      expect(updateMock).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          userId: 1,
          carId: 1,
          startDate: new Date("2023-06-01"),
          endDate: new Date("2023-06-05"),
          status: "confirmed",
        },
      });

      updateMock.mockRestore();
    });

    test("should not update a reservation if overlapping exists", async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        carId: 1,
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-06-05"),
        status: "confirmed",
      };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(
        mockReservation
      );
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
        mockReservation,
      ]);

      const reservation = updateReservation(
        1,
        1,
        1,
        new Date("2023-06-01"),
        new Date("2023-06-05"),
        "confirmed"
      );

      await expect(reservation).rejects.toThrow(
        "The car is not available for the selected dates"
      );

      const findUniqueMock = jest
        .spyOn(prisma.reservation, "findUnique")
        .mockRejectedValue(reservation);

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      findUniqueMock.mockRestore();

      const findManyMock = jest
        .spyOn(prisma.reservation, "findMany")
        .mockResolvedValue([]);

      expect(findManyMock).toHaveBeenCalledWith({
        where: {
          carId: 1,
          AND: [
            {
              id: { not: 1 },
              startDate: { lte: new Date("2023-06-05") },
              endDate: { gte: new Date("2023-06-01") },
            },
          ],
        },
      });

      findManyMock.mockRestore();

      const updateMock = jest
        .spyOn(prisma.reservation, "update")
        .mockRejectedValue(reservation);
      expect(updateMock).not.toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          userId: 1,
          carId: 1,
          startDate: new Date("2023-06-01"),
          endDate: new Date("2023-06-05"),
          status: "confirmed",
        },
      });

      updateMock.mockRestore();
    });

    test("should throw an error if reservation does not exist", async () => {
      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);
      const reservation = updateReservation(
        1,
        1,
        1,
        new Date("2023-06-01"),
        new Date("2023-06-05"),
        "confirmed"
      );

      await expect(reservation).rejects.toThrow("Reservation not found");

      const findUniqueMock = jest
        .spyOn(prisma.reservation, "findUnique")
        .mockRejectedValue(reservation);

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      findUniqueMock.mockRestore();

      const findManyMock = jest
        .spyOn(prisma.reservation, "findMany")
        .mockResolvedValue([]);

      expect(findManyMock).not.toHaveBeenCalledWith();

      findManyMock.mockRestore();

      const updateMock = jest
        .spyOn(prisma.reservation, "update")
        .mockRejectedValue(reservation);
      expect(updateMock).not.toHaveBeenCalledWith();

      updateMock.mockRestore();
    });

    test("should throw an error if updateReservation fails", async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        carId: 1,
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-06-05"),
        status: "confirmed",
      };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(
        mockReservation
      );
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.reservation.update as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(
        updateReservation(
          1,
          1,
          1,
          new Date("2023-06-01"),
          new Date("2023-06-05"),
          "confirmed"
        )
      ).rejects.toThrow("DB error");
    });
  });

  describe("getReservationsDuration", () => {
    test("should get reservations duration", async () => {
      const mockDurations = [
        { id: 1, startDate: "2023-01-01", endDate: "2023-01-05", duration: 5 },
        { id: 2, startDate: "2023-02-01", endDate: "2023-02-10", duration: 9 },
      ];

      (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockDurations);

      const durations = await getReservationsDuration();

      expect(durations).toEqual(mockDurations);
    });

    test("should throw an error if getReservationsDuration fails", async () => {
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(getReservationsDuration()).rejects.toThrow("DB error");
    });
  });
});
