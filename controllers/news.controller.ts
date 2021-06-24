import { Response, Request } from "express";
import { v4 as uuid } from "uuid";
import * as moment from "moment";
import { NewsItem } from "../models/news-item";
import { items } from "../utils/database";
import {
  HttpStatusCode,
  HttpResponseMessage,
} from "../utils/res-codes-messages";

export const addNewsItem = async (req: Request, res: Response) => {
  try {
    const item: NewsItem = req.body;
    item.item_id = uuid();
    item.timestamp = new Date(moment.utc().format());

    const data = items.insertOne(item);

    const itemsArray: NewsItem[] = [item];
    req.app.get("socketIo").to(item.channel).emit("getData", itemsArray);

    return res.status(HttpStatusCode.Ok).json({
      message: HttpResponseMessage.NewsItemAdded,
      item_id: item.item_id,
      timestamp: item.timestamp,
    });
  } catch (error) {
    return res
      .status(HttpStatusCode.InternalServerError)
      .json(HttpResponseMessage.InternalServerError);
  }
};
