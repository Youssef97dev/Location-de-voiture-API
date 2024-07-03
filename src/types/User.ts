import type { Reservation } from "./reservation";

export interface User {
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
}
