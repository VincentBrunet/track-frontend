import { Branded } from "../struct/Branded";

export type UserId = Branded<number, "UserId">;
export type UserEmail = Branded<string, "UserEmail">;
export interface User extends UserShell {
  id: UserId;
}
export interface UserShell {
  email: UserEmail;
}
