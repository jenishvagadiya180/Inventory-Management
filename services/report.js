import { productModel } from "../models/index.js";

class ReportService {
  static getInventoryList = async (filter, sortObj, skipRecord, limit) => {
    return await productModel
      .aggregate([
        {
          $match: filter,
        },
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
          $group: {
            _id: "$categoryDetails.name",
            totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          },
        },
        {
          $project: {
            category: "$_id",
            totalValue: 1,
            _id: 0,
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

  static getTotalProductRecord = async (filter) => {
    return await productModel
      .aggregate([
        {
          $match: filter,
        },
        {
          $project: {
            _id: 1,
          },
        },
      ])
      .collation({ locale: "en" });
  };

  static getSupplierProductCountList = async (
    filter,
    sortObj,
    skipRecord,
    limit
  ) => {
    return await productModel
      .aggregate([
        {
          $match: filter,
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
          $group: {
            _id: {
              $concat: [
                "$supplierDetails.firstName",
                " ",
                "$supplierDetails.lastName",
              ],
            },
            productCount: { $sum: 1 },
            products: {
              $push: {
                name: "$name",
                quantity: "$quantity",
              },
            },
          },
        },
        {
          $project: {
            supplier: "$_id",
            productCount: 1,
            products: 1,
            _id: 0,
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

  static getTotalRecordForSupplierProductCount = async (filter) => {
    return await productModel
      .aggregate([
        {
          $match: filter,
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
          $group: {
            _id: {
              $concat: [
                "$supplierDetails.firstName",
                " ",
                "$supplierDetails.lastName",
              ],
            },
            productCount: { $sum: 1 },
            products: {
              $push: {
                name: "$name",
                quantity: "$quantity",
              },
            },
          },
        },
        {
          $project: {
            supplier: "$_id",
            productCount: 1,
            products: 1,
            _id: 0,
          },
        },
      ])
      .collation({ locale: "en" });
  };
}

export default ReportService;
