import { validationResult } from "express-validator";
import statusCode from "./httpStatusCode.js";


console.log("hiii jenish")
console.log("hiii vagadiya jenish")
class services {
  static sendSuccess = async (res, message, payload) => {
    return services.setResponse(res, statusCode.SUCCESSFUL, message, payload);
  };
  static response = (code, message, data) => {
    if (data == null) {
      return {
        status: code,
        message: message,
      };
    } else {
      return {
        status: code,
        message: message,
        responseData: data,
      };
    }
  };

  static setResponse = async (res, statusCode, message, data) => {
    await res.send(this.response(statusCode, message, data));
  };

  static hasValidatorErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = "Validation Failed";
      this.setResponse(res, statusCode.BAD_REQUEST, msg, errors.array());
      return true;
    } else {
      return false;
    }
  };

  static regexSearch = (search, keys) => {
    let filter = { isDeleted: false };

    if (search) {
      filter.$or = keys.map((key) => {
        return {
          [key]: {
            $regex: search,
            $options: "i",
          },
        };
      });
    }
    return filter;
  };

  static paginationAndSorting = (query, defaultSortField) => {
    // pagination
    const { pageNumber, perPage, sortField, sortType } = query;
    let page = pageNumber ? parseInt(pageNumber) : 1;
    let limit = perPage ? parseInt(perPage) : 10;
    // Sorting
    let sortObj =
      sortField && sortType == "asc"
        ? { [sortField]: 1 }
        : sortField && sortType == "desc"
          ? { [sortField]: -1 }
          : { [defaultSortField]: 1 };
    return {
      page,
      skipRecord: (page - 1) * limit,
      limit,
      sortObj,
    };
  };

  static paginateResponse = (data, { page, limit }, totalRecord) => {
    const dataList = {};
    dataList.list = data;
    dataList.page = page;
    dataList.limit = limit;
    dataList.totalCount = totalRecord;
    dataList.totalPage = Math.ceil(totalRecord / limit);
    return dataList;
  };
}

export default services;
