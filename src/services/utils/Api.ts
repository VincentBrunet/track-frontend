import axios from "axios";
import { Tag } from "../../lib/data/Tag";
import { Value } from "../../lib/data/Value";

export class Api {
  static host = window.location.protocol + "//" + window.location.hostname;
  static root = Api.host + ":3001";

  public static async tagList(): Promise<Tag[]> {
    return await Api.get("/readings/tag-list");
  }

  public static async valueListRecent(): Promise<Value[]> {
    return await Api.get("/readings/value-list-recent");
  }

  public static async uploadValue(data: any): Promise<Value[]> {
    return await Api.post("/mutations/upload-value", data);
  }

  private static async get(path: string) {
    return await (await axios.get(Api.root + path)).data.data;
  }

  private static async post(path: string, data: any) {
    return await (await axios.post(Api.root + path, data)).data.data;
  }
}
