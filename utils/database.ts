import loki from "lokijs";
import { NewsItem } from "../models/news-item";

const lokiDB = new loki("octopus_db.json", {
  autosave: true,
  autosaveInterval: 100,
  autoload: true,
  persistenceMethod: "localStorage",
});

const items = lokiDB.addCollection<NewsItem>("items", {
  autoupdate: true,
});

export { lokiDB, items };
