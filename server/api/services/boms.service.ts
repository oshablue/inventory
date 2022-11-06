import l from "../../common/logger";
import mongoose from "mongoose";      // added for mongoose.Types.ObjectId()

import { Bom, IBomModel } from "../models/bom";
import { Component, IComponentModel } from "../models/component";
import { InventoryStmt }  from "../models/inventoryStmt";

export class BomsService {

  async getAll(): Promise<IBomModel[]> {
    l.info("fetch all boms");
    const boms = (await Bom.find(
      null//,
      //"-_id -__v"
    ).populate('component').lean()) as IBomModel[];
    return boms;
  }

  async getById(id: number): Promise<IBomModel> {
    l.info(`fetch bom with id ${id}`);
    const bom = (await Bom.findOne(
      { bom_id: id }//,
      //"-_id -__v"
    // ).populate({
    //   // https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
    //   path: 'lineItems',
    //   populate: {
    //     path: 'component',
    //     model: 'Component'
    //   }
    // }).lean()) as IBomModel;
    ).populate({
      path: 'lineItems.component'   // This works too and is much simpler
    })
    // .populate ( {
    //   path: 'lineItems.component.inventoryStmts'
    // })
    .populate({
      path: 'lineItems.component',  // 'lineItems.component.inventoryStmts didn't work
      populate: {                   // but this did for the actual population of inventoryStmts
        path: 'inventoryStmts'      // stopped working for trying to use component_id not _id
      }                             // for adding virtual to inventoryStmt to reverse get component
      //model: 'InventoryStmt'
      // Below: lean() excludes virtuals per documentation - not sure how goes with explicit population
    })
    .sort({'lineItems.lineNumber' : 1})) as IBomModel; //.exec()) as IBomModel; // //.lean()) as IBomModel; 
    return bom;
  }

  async create(data: IBomModel): Promise<IBomModel> {
    l.info(`create bom with data ${data}`);
    const bom = new Bom(data);
    // Now in the model _id is explicitly listed and thus must be explicitly populated, at least with the current versions of things
    // So for example like in a derived BOM if _id for each lineItem comes in blank, then create a new _id
    bom.lineItems.forEach( ( li, ind ) => {
      if ( !li._id ) {
        li._id = new mongoose.Types.ObjectId();
        bom.lineItems[ind] = li;
      }
    });
    const doc = (await bom.save()) as IBomModel;
    return doc;
  }

  async update(id: number, itemUpdate: IBomModel): 
  Promise<IBomModel | null> {
    l.info(`update bom with id ${id}`);
    let bom = (await Bom.findOne(
      { bom_id: id }
    )) as IBomModel;
    if (!bom) {
      l.info(`no bom found with id ${id}`);
      return null;
    }
    //bom = { id, ...itemUpdate }; // NOGOOD

    const doc = (await bom.updateOne(itemUpdate)) as IBomModel;
    //return doc;
    const updatedDoc = (await Bom.findOne({
      bom_id: id
    }).populate('componentType').lean()) as IBomModel;
    return updatedDoc; // boms[id];
  };

  async delete(id: number): Promise<object | null> {
    l.info(`delete bom with id ${id}`);
    let res = await Bom.deleteOne({ 
      bom_id: id 
    });
    if ( res && res.deletedCount ) {
      l.info(`deleted ${res.deletedCount} boms.`);
    }
    // res example is like:
    // {"n":1,"ok":1,"deletedCount":1}
    return res;
  };
} // class

export default new BomsService();
