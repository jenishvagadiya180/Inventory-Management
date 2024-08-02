import mongoose from "mongoose";
const { Schema } = mongoose;

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

const productModel = mongoose.model("product", productSchema);

export default productModel;
