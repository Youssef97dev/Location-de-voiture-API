import prisma from "@/lib/prisma";
import { getAvailableCars, getCarById } from "@/services/carService";

// Mock Prisma Client
jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    default: {
      car: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    },
  };
});

describe("Car Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvailableCars", () => {
    test("should get available cars", async () => {
      const mockCars = [
        {
          id: 1,
          brand: "Toyota",
          model: "Corolla",
          year: 2020,
          available: true,
        },
        { id: 2, brand: "Honda", model: "Civic", year: 2019, available: true },
      ];

      (prisma.car.findMany as jest.Mock).mockResolvedValue(mockCars);

      const cars = await getAvailableCars();

      expect(cars).toEqual(mockCars);
      expect(prisma.car.findMany).toHaveBeenCalledWith({
        where: { available: true },
      });
    });

    test("should throw an error if getAvailableCars fails", async () => {
      (prisma.car.findMany as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(getAvailableCars()).rejects.toThrow("DB error");
    });
  });

  describe("getCarById", () => {
    test("should get car by ID", async () => {
      const mockCar = {
        id: 1,
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        available: true,
      };

      (prisma.car.findUnique as jest.Mock).mockResolvedValue(mockCar);

      const car = await getCarById(1);

      expect(car).toEqual(mockCar);
      expect(prisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw an error if getCarById fails", async () => {
      (prisma.car.findUnique as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(getCarById(1)).rejects.toThrow("DB error");
    });
  });
});
