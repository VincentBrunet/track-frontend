import axios from "axios";
import { Tag } from "../../lib/data/Tag";
import { Value } from "../../lib/data/Value";

export class Api {
  static host = window.location.protocol + "//" + window.location.hostname;
  static root = Api.host + ":3001";

  public static async tagList(): Promise<Tag[]> {
    return await Api.get("/readings/tag-list");
  }

  public static async valueListForTag(tag: Tag): Promise<Value[]> {
    return await Api.get("/readings/value-list-for-tag", { id: tag.id });
  }

  public static async valueListForTags(
    tags: Tag[],
    condition?: "or" | "and",
    sort?: "asc" | "desc"
  ): Promise<Value[]> {
    return await Api.get("/readings/value-list-for-tags", {
      ids: tags.map((tag) => tag.id),
      condition: condition,
      sort: sort,
    });
  }

  public static async valueListRecent(): Promise<Value[]> {
    return await Api.get("/readings/value-list-recent");
  }

  public static async valueUpload(data: any): Promise<Value[]> {
    return await Api.post("/mutations/value-upload", {}, data);
  }

  private static async get(path: string, params?: any) {
    const config = { params: params };
    return await (await axios.get(Api.root + path, config)).data.data;
  }

  private static async post(path: string, params?: any, data?: any) {
    const config = { params: params };
    return await (await axios.post(Api.root + path, data, config)).data.data;
  }
}
