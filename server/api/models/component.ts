import mongoose from "mongoose";
import sequence from "mongoose-sequence";
const AutoIncrement = sequence(mongoose);

// For the object ref for componentType
import { PopulatedDoc } from "mongoose";
import { IComponentTypeModel, ComponentType } from "./componentType";
const InventoryStmt = require('./inventoryStmt');

// Note:
// component_id is set to autoincrement here
// on insertMany from e.g. /private/add-components.js or similar 
// (see sequence documentation also) the hook for autoincrement 
// is not called.  Se in that type of script that uses insertMany 
// instead of create we just manually track and update the component_id 
// since it is intended to be a unique key.
// However, then on POST, even if post includes an optional component_id 
// the autoincrement hook IS executed superceding any manually POSTed value 
// even if the autoincrement counter is very low - because it is not incremented 
// from insertMant - thus you'll get 500-errors related to duplicate key for 
// like component_id_1 (which is the name of key if you use like command below)
// duplicate of the number 8 even though the highest component number for insertMany was like 
// 210
// Showing command line:
// $ mongo
// > use inventory
// > db.components.getIndexes() # should be 2 in our implementation at this time 
// So we correct this at the moment with a command line fix to the counters collection
// in the mongodb:
// > db.counters.find({"id":"component_id"})
//     { "_id" : ObjectId("630fc35d92af588831e13d99"), "id" : "component_id", "reference_value" : null, "seq" : 211 }
// > db.counters.findOneAndUpdate({"id":"component_id"}, {$set:{"seq":211}})
// Now POSTed values with or without component_id included (these are ignored 
// for POST / new / save) will get an AutoIncremented (from sequence library) 
// value that starts correctly without duplicate.  Of course, $set to the correct 
// initial seq value




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
          "ALLIED",
          "ARROW",
          "AVNET",
          "QUEST",
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
