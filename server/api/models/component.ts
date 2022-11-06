import mongoose from "mongoose";
import sequence from "mongoose-sequence";
const AutoIncrement = sequence(mongoose);

// For the object ref for componentType
import { PopulatedDoc } from "mongoose";
import { IComponentTypeModel, ComponentType } from "./componentType";
const InventoryStmt = require('./inventoryStmt');


export interface IComponentModel extends mongoose.Document {
  component_id: number;
  name: string;
  description: string;
  value: string;          // TODO move to a category-specific spec hash
  package: string;        // TODO move to a category-specific spec hash
  assemblyType: string;
  mfg: string;
  mpn: string;
  dists: [{
    dist: string,
    dpn: string}];
  componentType: PopulatedDoc<IComponentTypeModel>;
}

const schema = new mongoose.Schema(
  {
    component_id: { type: Number, unique: true },
    name: String,
    description: String,
    value: String,          // TODO move to a category-specific spec hash
    package: String,        // TODO move to a category-specific spec hash
    assemblyType: String,
    mfg: String,
    mpn: String,
    dists: [{
      dist: {
        type: String,
        enum: [
          "DK",
          "MSR",
          "NWK",
          "ALLIEDELEC",
          "MFG Direct",
          "Not Set"
        ],
        default: "Not Set"
      },
      dpn: String}],
    componentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComponentType'
    }
  },
  {
    collection: "components",
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

schema.virtual('inventoryStmts', {
  ref: 'InventoryStmt',
  localField: 'component_id',
  foreignField: 'component_id',
  options: { sort: { 'updatedAt' : 'desc' } }
});

// TODO maybe create virtual or withQty or something that 
// grab the most recent inventory stmt quantity or quantity 
// total if multiple qts and return the qty for the component 
// table 


schema.plugin(AutoIncrement, { inc_field: "component_id" });

export const Component = mongoose.model<IComponentModel>("Component", schema);
