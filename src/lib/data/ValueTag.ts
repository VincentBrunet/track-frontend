import { Branded } from "../struct/Branded";
import { ValueId } from "./Value";
import { TagId } from "./Tag";

export type ValueTagId = Branded<number, "ValueTagId">;
export interface ValueTag extends ValueTagShell {
  id: ValueTagId;
}
export interface ValueTagShell {
  value_id: ValueId;
  tag_id: TagId;
}
