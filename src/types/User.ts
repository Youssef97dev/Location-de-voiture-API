import { Reservation } from "./Reservation";

export type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adresse: string;
  createdAt: Date;
  updatedAt: Date;

  reservations?: Reservation[];
};
