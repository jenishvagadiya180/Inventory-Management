import mongoose from "mongoose";
import { statusCode, message, services } from "../helper/index.js";
import { NotFoundError, RequestError } from "../error/index.js";
const send = services.setResponse;
import { ProductService } from "../services/index.js";

class Product {
  /**
   * This function for get Product Price History By SKU
   *  @param {String} req.params.sku
   * @returns Product Price History list
   */
  static getProductPriceHistoryBySKU = async (req, res, next) => {
    try {
      const checkProduct = await ProductService.checkProductByFindOne({
        sku: req.params.sku,
        isDeleted: false,
      });

      if (!checkProduct) throw new NotFoundError(message.PRODUCT_NOT_FOUND);

      const productPriceLogs = await ProductService.getProductPriceLogs(
        checkProduct?._id
      );

      if (!productPriceLogs)
        throw new NotFoundError(message.PRODUCT_PRICE_LOGS_NOT_FOUND);

      return send(
        res,
        statusCode.SUCCESSFUL,
        message.SUCCESSFUL,
        productPriceLogs
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for get Product List
   *  @param {Number} req.query.pageNumber
   *  @param {Number} req.query.perPage
   *  @param {String} req.query.sortType
   *  @param {String} req.query.sortField
   *  @param {String} req.query.search
   *  @param {String} req.query.name
   *  @param {Number} req.query.minPrice
   *  @param {Number} req.query.maxPrice
   *  @param {String} req.query.stockStatus
   * @returns Product list
   */
  static getProductList = async (req, res, next) => {
    try {
      let filter = services.regexSearch(req.query?.search, [
        "name",
        "quantity",
        "price",
        "sku",
        "categoryDetails.name",
      ]);

      if (req.query?.name) {
        filter.name = { $regex: req.query.name, $options: "i" };
      }

      if (req.query?.category) {
        filter.categoryId = new mongoose.Types.ObjectId(req.query.category);
      }

      if (req.query?.minPrice && req.query?.maxPrice) {
        filter.price = {
          $gte: parseFloat(req.query?.minPrice),
          $lte: parseFloat(req.query?.maxPrice),
        };
      }

      if (req.query?.stockStatus) {
        switch (req.query?.stockStatus.toLowerCase()) {
          case "in stock":
            filter.quantity = { $gt: 10 };
            break;
          case "low stock":
            filter.quantity = { $lte: 10 };
            break;
          default:
            break;
        }
      }

      const { page, skipRecord, limit, sortObj } =
        services.paginationAndSorting(req.query, "name");

      const getProductList = await ProductService.getProductList(
        filter,
        sortObj,
        skipRecord,
        limit
      );

      const totalRecord = await ProductService.getTotalRecordOfProduct({
        isDeleted: false,
      });

      const responseData = services.paginateResponse(
        getProductList,
        { page, limit },
        totalRecord.length
      );

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFUL, responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for update Product quantity in bulk
   * @param {*} req.body.percentageIncrease
   * @param {*} req.body.category
   * @returns count of updated Products
   */
  static updateProductQuantityInBulk = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }
      const multiplier = 1 + req.body?.percentageIncrease / 100;

      const checkCategory = await ProductService.getCategoryByFindOne({
        _id: req.body?.category,
        isDeleted: false,
      });

      if (!checkCategory)
        throw new NotFoundError(
          message.SOMETHING_WENT_WRONG_CATEGORY_NOT_FOUND
        );

      const result = await ProductService.updateProductByUpdateMany(
        filter,
        multiplier
      );

      if (!result)
        throw new RequestError(
          statusCode.SERVER_ERROR,
          message.SOMETHING_WENT_WRONG_WHILE_UPDATING_PRODUCT
        );

      return send(
        res,
        statusCode.SUCCESSFUL,
        message.PRODUCT_UPDATED_SUCCESSFULLY,
        { updatedCount: result.modifiedCount }
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for update Product price
   * @param {*} req.body.productId
   * @param {*} req.body.price
   * @returns Product Id
   */
  static updateProductPrice = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const checkProduct = await ProductService.checkProductByFindOne({
        _id: req.body?.productId,
        isDeleted: false,
      });

      if (!checkProduct)
        throw new NotFoundError(message.SOMETHING_WENT_WRONG_PRODUCT_NOT_FOUND);

      checkProduct.price = req.body?.price;
      const updateProduct = await checkProduct.save();

      if (!updateProduct)
        throw new RequestError(
          statusCode.SERVER_ERROR,
          message.SOMETHING_WENT_WRONG_WHILE_UPDATING_PRODUCT
        );

      return send(
        res,
        statusCode.SUCCESSFUL,
        message.PRODUCT_UPDATED_SUCCESSFULLY,
        { _id: updateProduct._id }
      );
    } catch (error) {
      next(error);
    }
  };
}

export default Product;
