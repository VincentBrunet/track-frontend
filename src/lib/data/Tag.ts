import { Branded } from "../struct/Branded";
import { UserId } from "./User";

export type TagId = Branded<number, "TagId">;
export type TagCode = Branded<string, "TagCode">;
export type TagName = Branded<string, "TagName">;
export interface Tag extends TagShell {
  id: TagId;
}
export interface TagShell {
  user_id: UserId;
  code: TagCode;
  name: TagName;
}
