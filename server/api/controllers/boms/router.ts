import express from "express";
import controller from "./controller";
export default express
  .Router()
  .post("/", controller.create)
  .get("/", controller.getAll)
  .get("/:id", controller.getById)
  .put("/:id", controller.update)
  .get("/:id/export", controller.exportById)
  .delete("/:id", controller.delete)
  .get("/:id/cseEdit/:lineItemId", controller.editCseById);
