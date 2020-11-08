import axios from "axios";

import { Tag } from "../../lib/data/Tag";
import { Value } from "../../lib/data/Value";

export class Api {
  static host = window.location.protocol + "//" + window.location.hostname;
  static root = Api.host + ":3001";

  public static async getTagList(): Promise<Tag[]> {
    return await Api.get("/indices/tag-list");
  }

  public static async getValueList(): Promise<Value[]> {
    return await Api.get("/indices/value-list");
  }

  private static async get(path: string) {
    return await (await axios.get(Api.root + path)).data.data;
  }
}
