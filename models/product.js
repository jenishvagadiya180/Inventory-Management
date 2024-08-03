import mongoose from "mongoose";
const { Schema } = mongoose;
import { priceChangeLogModel } from "./index.js";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (this.isModified("price")) {
    const original = await this.constructor.findById(this._id).exec();
    if (original && original?.price !== this.price) {
      await priceChangeLogModel.create({
        productId: this._id,
        oldPrice: original?.price,
        newPrice: this.price,
        reason: "Price has updated by API",
      });
    }
  }
  next();
});

const productModel = mongoose.model("product", productSchema);

export default productModel;
