import { Car } from "./Car";

export type Reservation = {
  id: number;
  userId: number;
  carId: number;
  startDate: Date;
  endDate: Date;
  status: string;

  car?: Car;
};

export type Duration = {
  startDate: Date;
  endDate: Date;
  duration: number;
};

export type Summary = {
  id: number;
  firstName: string;
  lastName: string;
  totalreservations: number;
  totalduration: number;
};
