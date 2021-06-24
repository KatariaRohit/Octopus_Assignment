import { Response, Request } from "express";
import { expect } from "chai";
import { Chance } from "chance";
import { describe, it } from "mocha";
import * as httpMocks from "node-mocks-http";
import loki from "lokijs";
import { HttpStatusCode } from "../utils/res-codes-messages";
import { NewsItem } from "../models/news-item";
import proxyquire from "proxyquire";

const chance: Chance.Chance = new Chance();
const lokiDBMock = new loki(chance.string());

const itemsMock = lokiDBMock.addCollection<NewsItem>("items", {
  autoupdate: true,
});

const testNewsController = proxyquire("../controllers/news.controller", {
  "../utils/database": {
    items: itemsMock,
  },
});

const req = httpMocks.createRequest();
const res = httpMocks.createResponse();

describe("Add News", () => {
  let addNewsItemMethods: (req: Request, res: Response) => Promise<Response>;
  let newsItemRequest: NewsItem;
  let newsItemResponse: NewsItem & LokiObj;

  beforeEach(() => {
    addNewsItemMethods = testNewsController.addNewsItem;

    newsItemRequest = {
      message: chance.string(),
      channel: chance.string(),
    } as NewsItem;

    newsItemResponse = {
      ...newsItemRequest,
      item_id: chance.string(),
      timestamp: chance.date(),
    } as NewsItem & LokiObj;
  });

  it("Should be able to Add News Item", async () => {
    itemsMock.insertOne = (): NewsItem & LokiObj => {
      return newsItemResponse;
    };

    req.body = newsItemRequest;
    await addNewsItemMethods(req, res);
    expect(res.statusCode).to.equal(HttpStatusCode.Ok);
  });

  it("Should return Internal Server Error", async () => {
    itemsMock.insertOne = (): NewsItem & LokiObj => {
      throw new Error();
    };

    req.body = newsItemRequest;
    await addNewsItemMethods(req, res);
    expect(res.statusCode).to.equal(HttpStatusCode.InternalServerError);
  });
});
