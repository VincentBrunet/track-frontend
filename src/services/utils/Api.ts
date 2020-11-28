import axios from "axios";
import { Tag } from "../../lib/data/Tag";
import { Value } from "../../lib/data/Value";

export class Api {
  static host = window.location.protocol + "//" + window.location.hostname;
  static root = Api.host + ":3001";

  public static async tagList(): Promise<Tag[]> {
    return await Api.get("/readings/tag-list");
  }

  public static async tagListForValues(values: Value[]): Promise<Tag[]> {
    return await Api.get("/readings/tag-list-for-values", {
      value_ids: values.map((value) => value.id),
    });
  }

  public static async valueListForTags(
    tags: Tag[],
    condition?: "or" | "and",
    sort?: "asc" | "desc"
  ): Promise<Value[]> {
    return await Api.get("/readings/value-list-for-tags", {
      tag_ids: tags.map((tag) => tag.id),
      condition: condition,
      sort: sort,
    });
  }

  public static async valueListRecent(): Promise<Value[]> {
    return await Api.get("/readings/value-list-recent");
  }

  public static async valueUpload(
    tags: Tag[],
    scalar?: number,
    title?: string,
    comment?: string
  ): Promise<Value[]> {
    return await Api.post(
      "/mutations/value-upload",
      {},
      {
        tag_ids: tags.map((tag) => tag.id),
        scalar: scalar,
        title: title,
        comment: comment,
      }
    );
  }

  public static async mappingForValues(
    values: Value[]
  ): Promise<{ tagsByValue: any; valuesByTag: any }> {
    return await Api.get("/readings/mapping-for-values", {
      value_ids: values.map((value) => value.id),
    });
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
