import { Branded } from "./../struct/Branded";
import { UserId } from "./User";

export type ValueId = Branded<number, "ValueId">;
export type ValueStamp = Branded<Date, "ValueStamp">;
export type ValueScalar = Branded<number, "ValueScalar">;
export type ValueTitle = Branded<number, "ValueTitle">;
export type ValueComment = Branded<number, "ValueComment">;
export interface Value extends ValueShell {
  id: ValueId;
}
export interface ValueShell {
  user_id: UserId;
  stamp: ValueStamp;
  scalar?: ValueScalar;
  title?: ValueTitle;
  comment?: ValueComment;
}
