import ComponentTypesService from "../../services/componentTypes.service";
import { Request, Response, NextFunction } from "express";

export class Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await ComponentTypesService.getAll();
      return res.status(200).render("index", {title: "Home", json:JSON.stringify(docs)}); //.json(docs);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComponentTypesService.getById(parseInt(req.params.id));
      if (doc) {
        return res.status(200).json(doc);
      }
      const errors = [{ message: "Component Type not found" }];
      return res.status(404).json({ errors });
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComponentTypesService.create(req.body);
      return res.status(201).location(`/api/v1/componentType/${doc.id}`).end();
    } catch (err) {
      return next(err);
    }
  }
}
export default new Controller();
