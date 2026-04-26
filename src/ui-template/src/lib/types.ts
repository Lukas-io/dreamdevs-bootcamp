export type Status = "ACTIVE" | "ARCHIVED";

export interface Item {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}
