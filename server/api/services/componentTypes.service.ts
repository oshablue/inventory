import l from "../../common/logger";

import { ComponentType, IComponentTypeModel } from "../models/componentType";

export class ComponentTypesService {
  async getAll(): Promise<IComponentTypeModel[]> {
    l.info("fetch all component types");
    const componentTypes = (await ComponentType.find(
      null//,
      //"-_id -__v"
    ).lean()) as IComponentTypeModel[];
    return componentTypes;
  }

  async getById(id: number): Promise<IComponentTypeModel> {
    l.info(`fetch component with id ${id}`);
    const componentType = (await ComponentType.findOne(
      { component_type_id: id }//,
      //"-_id -__v"
    ).lean()) as IComponentTypeModel;
    return componentType;
  }

  async create(data: IComponentTypeModel): Promise<IComponentTypeModel> {
    l.info(`create component with data ${data}`);
    const componentType = new ComponentType(data);
    const doc = (await componentType.save()) as IComponentTypeModel;
    return doc;
  }
}

export default new ComponentTypesService();
