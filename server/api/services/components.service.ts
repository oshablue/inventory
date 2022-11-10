import l from "../../common/logger";

import { Component, IComponentModel } from "../models/component";

export class ComponentsService {

  async getAll(): Promise<IComponentModel[]> {
    l.info("fetch all components");
    const components = (await Component.find(
      null//,
      //"-_id -__v"
    ).populate('componentType').lean()) as IComponentModel[]; // TODO do we want current Qtys?
    return components;
  }

  async getById(id: number): Promise<IComponentModel> {
    l.info(`fetch component with id ${id}`);
    const component = (await Component.findOne(
      { component_id: id }//,
      //"-_id -__v"
    ).populate('componentType').populate('inventoryStmts')) as IComponentModel;// no .lean() we have virtuals
    return component;
  }

  async create(data: IComponentModel): Promise<IComponentModel> {
    l.info(`create component with data ${JSON.stringify(data, null, 4)}`);
    const component = new Component(data);
    l.info(`create component with data ${JSON.stringify(component, null, 4)}`);
    const doc = (await component.save()) as IComponentModel;
    return doc;
  }

  async update(id: number, itemUpdate: IComponentModel): 
  Promise<IComponentModel | null> {
    l.info(`update component with id ${id}`);
    let component = (await Component.findOne(
      { component_id: id }
    )) as IComponentModel;
    if (!component) {
      l.info(`no component found with id ${id}`);
      return null;
    }
    //component = { id, ...itemUpdate }; // NOGOOD

    const doc = (await component.updateOne(itemUpdate)) as IComponentModel;
    //return doc;
    const updatedDoc = (await Component.findOne({
      component_id: id
    }).populate('componentType').populate('inventoryStmts').lean()) as IComponentModel;
    return updatedDoc; // components[id];
  };
} // class

export default new ComponentsService();
