import express from "express";
import { getStore } from "./catalog.js";
export function createApp(catalog) {
  const app = express();
  app.disable("x-powered-by");
  app.get("/api/health", (_, res) => res.json({ status: "ok" }));
  app.get("/api/store", (_, res) => res.json(getStore()));
  app.get("/api/products", (_, res) => res.json(catalog.all()));
  app.get("/api/products/:id", (req, res) => {
    const product = catalog.get(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });
  app.use("/api", (_, res) =>
    res.status(404).json({ error: "Endpoint not found" }),
  );
  return app;
}
