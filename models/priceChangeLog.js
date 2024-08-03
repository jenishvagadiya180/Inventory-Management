import mongoose from "mongoose";
import { Schema } from "mongoose";

const priceChangeLogSchema = new mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },

    oldPrice: {
      type: Number,
      required: true,
    },

    newPrice: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: Number,
  },
  { timestamps: true }
);

const priceChangeLogModel = mongoose.model(
  "priceChangeLog",
  priceChangeLogSchema
);

export default priceChangeLogModel;
