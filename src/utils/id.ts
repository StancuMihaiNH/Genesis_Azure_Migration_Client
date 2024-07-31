import { ulid } from "ulid";

export const newID = (): string => {
  return ulid();
};