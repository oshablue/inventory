import mongoose from "mongoose";
import sequence from "mongoose-sequence";
const AutoIncrement = sequence(mongoose);

// For the object ref for componentType
import { PopulatedDoc } from "mongoose";
import { IComponentModel, Component } from "./component";

export interface IBomModel extends mongoose.Document {
  bom_id: number;
  name: string;
  description: string;
  revision: string;
  derivedFromBom: number; // now just an integer PopulatedDoc<IBomModel>;  // Will be an actual _id not bom_id
  lineItems: [              // TODO move to separate schema?
    {                       // CAUTION - BUG? Although _id needed explicitly to use from controller, if defined, during data seed import, it will not be auto-created!
      _id: mongoose.Types.ObjectId; //string;          // add explicitly for ref in controller (ts)
      lineNumber: number;   // TODO should probably be derived/virtual? will likely need logic
      qtyPerBoard: number;  // TODO should probably be a derived virtual from refdes list
      refDess: [            // TODO is this what we really want? // TODO CAUTION this is changed in controller for export
        type: string
      ];
      component: PopulatedDoc<IComponentModel>; // TODO manage / add / array / alt / for substitute and alt compnts
      componentSelectEvents: [
        {
          eventType: string;
          component: PopulatedDoc<IComponentModel>;
          note: string;
        }
      ]
    }
  ]
}

const schema = new mongoose.Schema(
  {
    bom_id: { type: Number, unique: true },
    name: String,
    description: String,
    revision: String,
    derivedFromBom: Number, // Now just a number 
    /*{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bom'
    },*/
    lineItems: [
      {
        _id: mongoose.Schema.Types.ObjectId, // add explicitly for ref in controller (ts)
        lineNumber: Number,
        qtyPerBoard: Number,
        refDess: [
          String
        ],
        component: {
          //type: Component
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Component'
        },
        componentSelectionEvents: [
          {
            type: new mongoose.Schema(
              {
                eventType: {
                  type: String,
                  default: "Initial",
                  enum: [
                    "Initial", "Updated", "Alternate", "Substitute", "Untested Possibility"
                  ]
                },
                component: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Component'
                },
                note: String
              },{
                timestamps: true
              }
            )
          }
        ]
      }
    ]
  },
  {
    collection: "boms",
    toObject: { virtuals: true },
    toJSON: { virtuals: true}
  }
);

schema.plugin(AutoIncrement, { inc_field: "bom_id" });

export const Bom = mongoose.model<IBomModel>("Bom", schema);
