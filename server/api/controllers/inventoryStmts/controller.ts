import InventoryStmtsService from "../../services/inventoryStmts.service";
import { Request, Response, NextFunction } from "express";
// Agonizing debugging - the below method to import Component
// when trying to access the paths and enumValues according to all
// various docs and examples failed at compilation, though the 
// calls and dot accesses worked during debugging. Perhaps 
// some issue with how the model is array nested and what not 
// BUT when it worked during debugging, this was actually 
// compiled by ts I guess to actually be like the require 
// anyway!! -- so just putting it this way manually now, 
// using require instead of import and prefixing all 
// Component references with component_1.Component 
// just like was happening after compilation as evident during 
// debugging, eg using Chrome nodejs tools to inspect actual 
// js source.
//import { Component } from "../../models/component";
const inventoryStmt_1 = require("../../models/inventoryStmt");
const bom_1 = require("../../models/bom");
import ComponentsService from "../../services/components.service";

export class Controller {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await InventoryStmtsService.getAll();
      const schemaKeys = Object.keys(inventoryStmt_1.InventoryStmt.schema.paths); // See note at require/import
      return res.status(200).render(
        "inventoryStmts", 
        {title: "Home", dataPayload: docs, keysPayload: schemaKeys} // jsonPayload: JSON.stringify(docs), htmlPayload: h}
      );
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await InventoryStmtsService.getById(parseInt(req.params.id));
      const comps = await ComponentsService.getAll();
      const schemaKeys = Object.keys(inventoryStmt_1.InventoryStmt.schema.paths);
      let lineItemSchemaKeys = Object.keys(inventoryStmt_1.InventoryStmt.schema.path('quantities').schema.paths);
      // add some inventoryStmts from the Component model (it's a virtual)
      //lineItemSchemaKeys.push('inventoryStmts');
      if (doc) {
        return res.status(200).render("inventoryStmt", { 
          dataPayload: doc, 
          componentsPayload: comps,
          keysPayload: schemaKeys,
          lineItemsSchemaKeysPayload: lineItemSchemaKeys
        });
      }
      const errors = [{ message: "InventoryStmt not found" }];
      return res.status(404).json({ errors });
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await InventoryStmtsService.create(req.body);
      return res.status(201).location(`/api/v1/inventoryStmts/${doc.id}`).end();
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await InventoryStmtsService.update(
        parseInt(req.params.id), 
        req.body);
      return res.status(200).send(doc);
    } catch (err) {
      return next(err);
    }
  }
}
export default new Controller();
