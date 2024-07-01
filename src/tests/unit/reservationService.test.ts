import prisma from "@/lib/prisma";
import {
  createReservation,
  updateReservation,
  getReservationsDuration,
} from "@/services/reservationService";

// Mock Prisma Client
jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    default: {
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
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: {
          id: 1,
          AND: [
            {
              startDate: { lte: new Date("2023/06/05") },
              endDate: { gte: new Date("2023/06/01") },
            },
          ],
        },
      });
      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          carId: 1,
          startDate: new Date("2023/06/01"),
          endDate: new Date("2023/06/05"),
          status: "confirmed",
        },
      });
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

      const reservation = await createReservation(
        1,
        1,
        new Date("2023/06/01"),
        new Date("2023/06/05"),
        "confirmed"
      );

      expect(reservation).toBeUndefined();
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: {
          id: 1,
          AND: [
            {
              startDate: { lte: new Date("2023/06/05") },
              endDate: { gte: new Date("2023/06/01") },
            },
          ],
        },
      });
      expect(prisma.reservation.create).not.toHaveBeenCalled();
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
      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
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
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          userId: 1,
          carId: 1,
          startDate: new Date("2023-06-01"),
          endDate: new Date("2023-06-05"),
          status: "confirmed",
        },
      });
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

      await expect(
        updateReservation(
          1,
          1,
          1,
          new Date("2023-06-01"),
          new Date("2023-06-05"),
          "confirmed"
        )
      ).rejects.toThrow("The car is not available for the selected dates");

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
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
      expect(prisma.reservation.update).not.toHaveBeenCalled();
    });

    test("should throw an error if reservation does not exist", async () => {
      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        updateReservation(
          1,
          1,
          1,
          new Date("2023-06-01"),
          new Date("2023-06-05"),
          "confirmed"
        )
      ).rejects.toThrow("Reservation not found");

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.reservation.findMany).not.toHaveBeenCalled();
      expect(prisma.reservation.update).not.toHaveBeenCalled();
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
