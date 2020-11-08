import axios from "axios";

export class Api {
  static host = window.location.protocol + "//" + window.location.hostname;
  static root = Api.host + ":3001";

  public static async getTagList(): Promise<Tag[]> {
    return await Api.get("/indices/tag-list");
  }

  public static async getTickerSummary(code: string) {
    return await Api.get("/pages/ticker-summary/" + code);
  }

  public static async getScreenerTable() {
    return await Api.get("/pages/screener-table");
  }

  private static async get(path: string) {
    return await (await axios.get(Api.root + path)).data.data;
  }
}
