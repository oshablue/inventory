import ComponentsService from "../../services/components.service";
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
const component_1 = require("../../models/component");
import ComponentTypesService from "../../services/componentTypes.service";

export class Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await ComponentsService.getAll();
      // Try to create a table / datagrid
      // https://stackoverflow.com/questions/17035297/getting-schema-attributes-from-mongoose-model
      // This is the wrong place for this render logic I feel -- where should it go? 
      // Middleware?
      // It is however specific to the components listing all 
      const schemaKeys = Object.keys(component_1.Component.schema.paths); // See note at require/import
      // let h = "";
      // h += "<table><thead>";
      // schemaKeys.forEach( (k) => {
      //   console.log(k);
      //   h+= "<td>" + k + "</td>"
      // });
      // h += "<td>" + "Edit Link" + "</td>"
      // h += "</thead>"
      // docs.forEach( (d) => {
      //   h += "<tr>"
      //   schemaKeys.forEach( (k) => {
      //     console.log(d[`${k}`]);
      //     h += "<td>" + JSON.stringify(d[`${k}`]) + "</td>"
      //   });
      //   h += "<td>" + 
      //     "<a href=\"/api/v1/components/" + 
      //     `${d["component_id"]}` + "\">Edit</a>" + "</td>"
      //   h += "</tr>"
      // })
      // h += "</table>"
      return res.status(200).render(
        "components", 
        {title: "Home", dataPayload: docs, keysPayload: schemaKeys} // jsonPayload: JSON.stringify(docs), htmlPayload: h}
      ); //.json(docs);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComponentsService.getById(parseInt(req.params.id));
      const compTypes = await ComponentTypesService.getAll();
      const schemaKeys = Object.keys(component_1.Component.schema.paths);
      //let distEnums = Object.keys(component_1.Component.schema.path('dists'));
      let distEnums = component_1.Component.schema.path('dists.0.dist').enumValues; // OY! See note at import/requires
      console.log(JSON.stringify(distEnums));
      let distsSchemaKeys = Object.keys(component_1.Component.schema.path('dists').schema.paths);
      console.log(JSON.stringify(distsSchemaKeys));
      if (doc) {
        return res.status(200).render("component", { 
          dataPayload: doc, 
          componentTypesPayload: compTypes,
          keysPayload: schemaKeys,
          distsPayload: { 
            "distList": distEnums,
            "dists" : distsSchemaKeys
          }
        }); // .json(doc)
      }
      const errors = [{ message: "Component not found" }];
      return res.status(404).json({ errors });
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComponentsService.create(req.body);
      return res.status(201).location(`/api/v1/component/${doc.id}`).end();
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComponentsService.update(
        parseInt(req.params.id), 
        req.body);
      return res.status(200).send(doc);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
}
export default new Controller();
