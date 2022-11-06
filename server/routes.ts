import { Application } from "express";
import examplesRouter from "./api/controllers/examples/router";
import componentsRouter from "./api/controllers/components/router";
import componentTypesRouter from "./api/controllers/componentTypes/router";
import bomsRouter from "./api/controllers/boms/router";
import inventoryStmtsRouter from "./api/controllers/inventoryStmts/router"
export default function routes(app: Application): void {
  app.use("/api/v1/examples", examplesRouter);
  app.use("/api/v1/components", componentsRouter);
  app.use("/api/v1/componentTypes", componentTypesRouter);
  app.use("/api/v1/boms", bomsRouter);
  app.use("/api/v1/inventoryStmts", inventoryStmtsRouter);
}
