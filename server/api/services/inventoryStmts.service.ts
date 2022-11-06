import l from "../../common/logger";

import { InventoryStmt, IInventoryStmtModel } from "../models/inventoryStmt";
import { Component, IComponentModel } from "../models/component";

// TODO this is just an incomplete placeholder draft

export class InventoryStmtsService {

  async getAll(): Promise<IInventoryStmtModel[]> {
    l.info("fetch all inventoryStmts");
    const iss = (await InventoryStmt.find(
      null//,
      //"-_id -__v"
    ).populate('component')) as IInventoryStmtModel[]; // not .lean() as this might exclude virtuals?
    return iss;
  }

  async getById(id: number): Promise<IInventoryStmtModel> {
    l.info(`fetch inventoryStmt with id ${id}`);
    const invStmt = (await InventoryStmt.findOne(
      { inventoryStmt_id: id }
    ).populate({
      path: 'component' // This works too and is much simpler
    })) as IInventoryStmtModel; // no .lean() since we need virtuals?
    return invStmt;
  }

  async create(data: IInventoryStmtModel): Promise<IInventoryStmtModel> {
    l.info(`create inventoryStmt with data ${data}`);
    const invStmt = new InventoryStmt(data);
    const doc = (await invStmt.save()) as IInventoryStmtModel;
    return doc;
  }

  async update(id: number, itemUpdate: IInventoryStmtModel): 
  Promise<IInventoryStmtModel | null> {
    l.info(`update inventoryStmt with id ${id}`);
    let invStmt = (await InventoryStmt.findOne(
      { inventoryStmt_id: id }
    )) as IInventoryStmtModel;
    if (!invStmt) {
      l.info(`no inventoryStmt found with id ${id}`);
      return null;
    }
    //bom = { id, ...itemUpdate }; // NOGOOD

    const doc = (await invStmt.updateOne(itemUpdate)) as IInventoryStmtModel;
    //return doc;
    const updatedDoc = (await InventoryStmt.findOne({
      inventoryStmt_id: id
    }).populate('component')) as IInventoryStmtModel;
    return updatedDoc; // boms[id];
  };
} // class

export default new InventoryStmtsService();
