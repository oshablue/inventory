import mongoose from "mongoose";
import sequence from "mongoose-sequence";
const AutoIncrement = sequence(mongoose);

// For the object ref for componentType
import { PopulatedDoc } from "mongoose";
import { IComponentModel, Component } from "./component";

const stmtTypeEnum = [
  "Hand Count",
  "On Order",
  "Updated Estimate",
  "Last Project Count"
];

const packagingEnum = [
  "NOT SET",
  "TODO VFY",
  "TUBE",
  "TRAY",
  "REEL",
  "CUT TAPE",
  "LOOSE",
  "PT", "CPT", "CPT REEL", "REEL", "BPT", "TUBE + LOOSE", "SEALED BAG", "CPT + LOOSE"
];

const packagingSpecEnum = [
  "Not Set",
  "TODO Vfy",
  "PT-8p2mm", "PT-8p4mm", "PT-8p8mm", 
  "CPT-8p4mm", "CPT-8p8mm", "CPT-12p4mm", "CPT-12p8mm",
  "BPT-8p4mm", "BPT-8p8mm", "BPT-12p4mm", "BPT-12p8mm", "BPT-16p8mm", "BPT-24p16mm"
];

const locationEnum = [
  "Not Set",
  "Project Box",
  "SheSho",
  "GXN",
  "Bittele",
  "UT Order",
  "RS104",
  "RS8",
  "DL0100A1",
  "On Order"
];

export interface IInventoryStmtModel extends mongoose.Document {
  inventoryStmt_id: number;
  stmtType: string;
  description: string;
  isActive: boolean;
  quantities: [
    {
      quantity: number;
      packaging: string;
      packagingSpec: string;
      location: string;
    }
  ];
  component_id: number;
  //component_id: PopulatedDoc<IComponentModel>; // inventoryStmt is tied to a component
}

const schema = new mongoose.Schema(
  {
    inventoryStmt_id: { type: Number, unique: true },
    stmtType: { 
      type: String,
      enum: stmtTypeEnum,
      default: "Hand Count"
    },
    description: String,
    isActive: {
      type: String,
      default: true
    },
    quantities: [
      {
        quantity: Number,
        packaging: {
          type: String,
          enum: packagingEnum,
          default: "CUT TAPE"
        },
        packagingSpec: {
          type: String,
          enum: packagingSpecEnum,
          default: "PT-8p2mm"
        },
        location: {
          type: String,
          enum: locationEnum,
          default: "Project Box"
        }
      }
    ]
    ,
    component_id: {
      type: Number//, // mongoose.Schema.Types.ObjectId, 
      //ref: 'Component'
    }
  },
  {
    collection: "inventoryStmts",
    timestamps: true,
    toObject: { virtuals : true },
    toJSON: { virtuals : true}
  }
);

schema.virtual('component', {
  ref: 'Component',
  localField: 'component_id',
  foreignField: 'component_id'//,
  //options: { sort: { 'updatedAt' : 'desc' } }
});

schema.plugin(AutoIncrement, { inc_field: "inventoryStmt_id" });

export const InventoryStmt = mongoose.model<IInventoryStmtModel>("InventoryStmt", schema);
