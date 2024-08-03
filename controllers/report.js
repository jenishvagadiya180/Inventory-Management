import { productModel } from "../models/index.js";
import { statusCode, message, services } from "../helper/index.js";
import { NotFoundError, RequestError } from "../error/index.js";
import { ReportService } from "../services/index.js";
const send = services.setResponse;

class Report {
  /**
   * This function for get Inventory values
   *  @param {Number} req.query.pageNumber
   *  @param {Number} req.query.perPage
   *  @param {String} req.query.sortType
   *  @param {String} req.query.sortField
   * @returns Inventory Values list
   */
  static getInventoryValues = async (req, res, next) => {
    try {
      const { page, skipRecord, limit, sortObj } =
        services.paginationAndSorting(req.query, "category");

      const filter = { isDeleted: false };

      const inventoryValueList = await ReportService.getInventoryList(
        filter,
        sortObj,
        skipRecord,
        limit
      );

      const totalRecord = await ReportService.getTotalProductRecord(filter);

      const responseData = services.paginateResponse(
        inventoryValueList,
        { page, limit },
        totalRecord.length
      );
      if (!inventoryValueList)
        throw new RequestError(
          message.SOMETHING_WENT_WRONG_INVENTORY_VALUE_NOT_FOUND
        );

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFUL, responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * This function for get Supplier Product Count
   *  @param {Number} req.query.pageNumber
   *  @param {Number} req.query.perPage
   *  @param {String} req.query.sortType
   *  @param {String} req.query.sortField
   * @returns Supplier Product Count
   */
  static getSupplierProductCount = async (req, res, next) => {
    try {
      const filter = { isDeleted: false };
      const { page, skipRecord, limit, sortObj } =
        services.paginationAndSorting(req.query, "supplier");

      const suplierProductCountList =
        await ReportService.getSupplierProductCountList(
          filter,
          sortObj,
          skipRecord,
          limit
        );

      const totalRecord =
        await ReportService.getTotalRecordForSupplierProductCount(filter);

      const responseData = services.paginateResponse(
        suplierProductCountList,
        { page, limit },
        totalRecord.length
      );

      if (!suplierProductCountList)
        throw new NotFoundError(
          message.SOMETHING_WENT_WRONG_SUPPLIER_PRODUCT_LIST_NOT_FOUND
        );

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFUL, responseData);
    } catch (error) {
      next(error);
    }
  };
}

export default Report;
