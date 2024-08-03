import {
  productModel,
  priceChangeLogModel,
  categoryModel,
} from "../models/index.js";
import mongoose from "mongoose";

class ProductService {
  static checkProductByFindOne = async (filter) => {
    return await productModel.findOne(filter).exec();
  };

  static getProductPriceLogs = async (productId) => {
    return await priceChangeLogModel.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $project: {
          oldPrice: 1,
          newPrice: 1,
          changeDate: {
            $dateToString: {
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              date: { $toDate: "$createdAt" },
            },
          },
          reason: 1,
        },
      },
      {
        $sort: {
          changeDate: -1,
        },
      },
    ]);
  };

  static getProductList = async (filter, sortObj, skipRecord, limit) => {
    return await productModel
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $lookup: {
            from: "users",
            localField: "supplierId",
            foreignField: "_id",
            as: "supplierDetails",
          },
        },
        {
          $unwind: "$supplierDetails",
        },
        {
          $match: filter,
        },
        {
          $project: {
            name: 1,
            sku: 1,
            category: "$categoryDetails.name",
            quantity: 1,
            price: 1,
            supplier: {
              $concat: [
                "$supplierDetails.firstName",
                " ",
                "$supplierDetails.lastName",
              ],
            },
            lastUpdated: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: { $toDate: "$updatedAt" },
              },
            },
          },
        },

        {
          $sort: sortObj,
        },
        {
          $skip: skipRecord,
        },
        {
          $limit: limit,
        },
      ])
      .collation({ locale: "en" });
  };

  static getTotalRecordOfProduct = async (filter) => {
    return await productModel
      .aggregate([
        {
          $match: filter,
        },
      ])
      .collation({ locale: "en" });
  };

  static getCategoryByFindOne = async (filter) => {
    return await categoryModel.findOne(filter);
  };

  static updateProductByUpdateMany = async (filter, multiplier) => {
    return await productModel.updateMany(filter, [
      {
        $set: {
          quantity: {
            $ceil: {
              $multiply: ["$quantity", multiplier],
            },
          },
        },
      },
    ]);
  };
}

export default ProductService;
