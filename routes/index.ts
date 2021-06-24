import express from "express";
import newsItemRoute from "./news.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/news",
    route: newsItemRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
