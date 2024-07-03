import type { Car } from "./car";

export interface Reservation {
  id: number;
  userId: number;
  carId: number;
  startDate: Date;
  endDate: Date;
  status: string;

  car?: Car;
}

export interface Duration {
  startDate: Date;
  endDate: Date;
  duration: number;
}

export interface Summary {
  id: number;
  firstName: string;
  lastName: string;
  totalreservations: number;
  totalduration: number;
}
