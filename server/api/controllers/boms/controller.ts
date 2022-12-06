import BomsService from "../../services/boms.service";
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
const bom_1 = require("../../models/bom");
import ComponentsService from "../../services/components.service";

const { Parser, transforms: { unwind, flatten } } = require('json2csv'); // json2csv 5.n.n



export class Controller {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await BomsService.getAll();
      // Try to create a table / datagrid
      // https://stackoverflow.com/questions/17035297/getting-schema-attributes-from-mongoose-model
      // This is the wrong place for this render logic I feel -- where should it go? 
      // Middleware?
      // It is however specific to the components listing all 
      const schemaKeys = Object.keys(bom_1.Bom.schema.paths); // See note at require/import
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
        "boms", 
        {title: "Home", dataPayload: docs, keysPayload: schemaKeys} // jsonPayload: JSON.stringify(docs), htmlPayload: h}
      ); //.json(docs);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await BomsService.getById(parseInt(req.params.id));
      const comps = await ComponentsService.getAll();
      const schemaKeys = Object.keys(bom_1.Bom.schema.paths);
      let lineItemSchemaKeys = Object.keys(bom_1.Bom.schema.path('lineItems').schema.paths);
      // add some inventoryStmts from the Component model (it's a virtual)
      lineItemSchemaKeys.push('inventoryStmts');
      let bomRolesEnumPayload = 
        bom_1.Bom.schema.path('lineItems').schema.path('bomRole').enumValues;
      if (doc) {
        return res.status(200).render("bom", { 
          dataPayload: doc, 
          componentsPayload: comps,
          keysPayload: schemaKeys,
          lineItemsSchemaKeysPayload: lineItemSchemaKeys,
          bomRolesEnumPayload: bomRolesEnumPayload
        });
      }
      const errors = [{ message: "Bom not found" }];
      return res.status(404).json({ errors });
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await BomsService.create(req.body);
      return res.status(201).location(`/api/v1/boms/${doc.id}`).end();
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await BomsService.update(
        parseInt(req.params.id), 
        req.body);
      return res.status(200).send(doc);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await BomsService.delete(
          parseInt(req.params.id)
        );
      return res.status(200).send(doc);
    } catch (err) {
      return next(err);
    }
  }

  async exportById(req: Request, res: Response, next: NextFunction) {
    
    try {
    
      const doc = await BomsService.getById(parseInt(req.params.id));

      const comps = await ComponentsService.getAll();
      const schemaKeys = Object.keys(bom_1.Bom.schema.paths);
      let lineItemSchemaKeys = Object.keys(bom_1.Bom.schema.path('lineItems').schema.paths);
      lineItemSchemaKeys.push('inventoryStmts');

      /* "lineItems": 
      [
      {
        "refDess":["6-12VDC 5VDCEXT CDONE CRSTB JP5VDCEXT"],
        "_id":"633236eee453bf11aa46d46d",
        "lineNumber":1,
        "qtyPerBoard":5,
        "componentSelectionEvents":[
          {
            "eventType":"Initial",
            "_id":"633236eee453bf11aa46d46e",
            "component":"633236ece453bf11aa46d274"
          }
        ],
        "component":{
          "_id":"633236ece453bf11aa46d274",
          "dists":[
            {
              "dist":"DK",
              "_id":"633236ece453bf11aa46d275",
              "dpn":"609-3502-ND"
            }
          ],
          "component_id":1,
          "name":"1X02_SMALL PINHD-1X2/SM",
          "description":"1X02_SMALL PIN HEADER",
          "mfg":"Amphenol",
          "mpn":"68000-202HLF",
          "__v":0,
          "inventoryStmts":[
            {
              "stmtType":"Hand Count",
              "isActive":"true",
              "_id":"633236ede453bf11aa46d349",
              "quantities":[
                {
                  "packaging":"LOOSE",
                  "packagingSpec":"PT-8p2mm",
                  "location":"Project Box",
                  "_id":"633236ede453bf11aa46d34a",
                  "quantity":89
                }
              ],
              "inventoryStmt_id":1,
              "component_id":1,
              "__v":0,
              "createdAt":"2022-09-26T23:34:05.555Z",
              "updatedAt":"2022-09-26T23:34:05.555Z",
              "id":"633236ede453bf11aa46d349"
            }
          ],
          "id":"633236ece453bf11aa46d274"
        }
      }
      ]
      */

      if (doc) {

        let dat = doc.toJSON();
        let lis = dat.lineItems; // actually the library works just fine without this from just doc.toJSON()

        let maxDists = 0;
        let lisToExport = lis.map( (li, i) => {
          // Only return a row lineItem if component selected and there is at least one dist (?)
          // TODO CAUTION - probably update this behavior above for export
          if ( li.component && li.component.dists ) {
            // Also if quantity is zero and trim() of refDess is blank, like when a BOM 
            // variant has been created that clears out a line item but the blank line is
            // retained for compatibility, we would like to include a note about this in the BOM
            // TODO need to update the quantity per board to be pulled from the single calc method 
            // in the model and populate that on query probably
            let v = li.refDess.toString()||""; //- TODO this should prob be virt in model
            let m = (v.match(/,/g) || []).length;
            let c = m ? "," : " ";
            let q = v ? v.split(c).length : 0;
            li.qtyPerBoard = q;
            li.component.dists.forEach( (d, j) => {
              li.component["DIST"+(j+1).toString()] = d.dist;
              li.component["DPN"+(j+1).toString()] = d.dpn;
              maxDists = j > maxDists ? j : maxDists;   // base 0
            });
            // Also fix the refDess [" ... "] thing CAUTION model may change or be corrected
            if ( li.refDess && li.refDess[0] ) {
              li["refDessFlat"] = li.refDess[0]; //.replace(/\[\]/g, '');
            }
            if ( li.qtyPerBoard < 1 ) {
              li["refDessFlat"] = "DNP QTY 0 NO REFDES - LINE NUM RETAINED BUT BLANK INTENTIONALLY";
            }
            return li;
          }
        });

        maxDists++; // base 1
        //console.log (`bom controller: maxDists: ${maxDists}`);
        //console.log(`lisToExport: ${JSON.stringify(lisToExport)}`);

        //const json2csvParser = new Parser({ transforms: [unwind({ paths, blankOut: true }), flatten('__')] });
        
        let distFields = [];
        for ( let i = 0; i < maxDists; i++ ) {
          let h = {};
          h["value"] = "component_DIST"+(i+1).toString();
          h["label"] = "DIST"+(i+1).toString();;
          distFields.push(h);
          h = {}
          h["value"] = "component_DPN"+(i+1).toString();
          h["label"] = "DPN"+(i+1).toString();
          distFields.push(h);
        }

        let fields = [
          {
            label: "LineNum",
            value: "lineNumber"
          },
          {
            label: 'QtyPerBoard',
            value: 'qtyPerBoard'
          },
          {
            label: 'RefDes',
            value: 'refDessFlat'
          },
          {
            label: 'Value',
            value: 'component_value'
          },
          {
            label: 'Package',
            value: 'component_package'
          },
          {
            label: 'MFG',
            value: 'component_mfg'
          },
          {
            label: 'MPN',
            value: 'component_mpn'
          },
          {
            label: 'AssemblyType',
            value: 'component_assemblyType'
          }
        ];

        distFields.forEach( (df) => {
          fields.push(df);
        });
        
        const json2csvParser = new Parser({ 
          fields: fields,
          transforms: [
            flatten({
              separator: '_'
            })
          ] 
        });
        const data = json2csvParser.parse(lisToExport); //(dat.lineItems); 

        const timestamp = new Date().toISOString().slice(0,19).replace(/:/g,''); // yyyy-mm-ddThhmmss (as UTC)
        
        const fname = "BOM " + dat.revision + " " + dat.name + " " + timestamp + ".csv";
      
        res.attachment(fname);
        return res.status(200).send(data);

        // return res.status(200).render("bom", { 
        //   dataPayload: doc, 
        //   componentsPayload: comps,
        //   keysPayload: schemaKeys,
        //   lineItemsSchemaKeysPayload: lineItemSchemaKeys
        // });
      }
    
      const errors = [{ message: "Bom not found" }];
      return res.status(404).json({ errors });
    
    } catch (err) {
    
      return next(err);
    
    }
  }


  async editCseById(req: Request, res: Response, next: NextFunction) {
    try {
      //console.log(req);
      const doc = await BomsService.getById(parseInt(req.params.id));
      const comps = await ComponentsService.getAll();
      const schemaKeys = Object.keys(bom_1.Bom.schema.paths);
      let lineItemSchemaKeys = Object.keys(bom_1.Bom.schema.path('lineItems').schema.paths);
      let componentSelectionEventKeys = 
        Object.keys(bom_1.Bom.schema.path('lineItems').schema.path('componentSelectionEvents').schema.paths);
      let componentSelectionEventTypes = 
        bom_1.Bom.schema.path('lineItems').schema.path('componentSelectionEvents').schema.path('eventType').enumValues;
      // Useful paths etc:
      // bom_1.Bom.schema.path('lineItems').schema.path('componentSelectionEvents').schema.path('eventType').enumValues
      // Object.keys(bom_1.Bom.schema.path('lineItems').schema.path('componentSelectionEvents').schema.paths)

      // add some inventoryStmts from the Component model (it's a virtual)
      lineItemSchemaKeys.push('inventoryStmts');
      if (doc) {
        const lineItemRow = doc.lineItems.findIndex(v => v._id.toString() === req.params.lineItemId);
        const lineItem = doc.lineItems[lineItemRow];
        //console.log(req.params.id, lineItemRow, lineItem, req.params.lineItemId);
        //console.log(req.params.lineItemId);
        return res.status(200).render("bomLineItem", {  // TODO now create bomLineItem view and select data to send
          dataPayload: lineItem,
          bomPayload: doc,
          componentsPayload: comps,
          keysPayload: lineItemSchemaKeys,
          lineItemsSchemaKeysPayload: lineItemSchemaKeys,
          componentSelectionEventKeysPayload: componentSelectionEventKeys,
          componentSelectionEventTypesPayload: componentSelectionEventTypes
        });
        // TODO then also need an update method? or how to store or send the bom and use the bom object to update?
      }
      const errors = [{ message: "Bom not found" }];
      return res.status(404).json({ errors });
    } catch (err) {
      return next(err);
    }
  }

}


export default new Controller();
