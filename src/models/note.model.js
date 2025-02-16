import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const noteSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "Dont create an Empty notes"],
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(mongooseAggregatePaginate)

export const noteModel = mongoose.model("notes", noteSchema);