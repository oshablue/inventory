import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const AutoIncrement = sequence(mongoose);

export interface IComponentTypeModel extends mongoose.Document {
  component_type_id: number;
  name: string;
  description: string;
}

const schema = new mongoose.Schema(
  {
    component_type_id: { type: Number, unique: true },
    name: String,
    description: String
  },
  {
    collection: "componentTypes",
  }
);

schema.plugin(AutoIncrement, { inc_field: "component_type_id" });

export const ComponentType = mongoose.model<IComponentTypeModel>("ComponentType", schema);
