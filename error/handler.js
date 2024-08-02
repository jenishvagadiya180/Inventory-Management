import { services, statusCode, message } from "../helper";
const send = services.setResponse;

const errorhandler = (error, req, res) => {
  console.log("error :>> ", error);
  let errorObj = {
    title: error.name,
    routeName: req.path,
    errorData: {
      message: error.message,
      stack: error.stack,
    },
  };
  return send(
    res,
    error?.code || statusCode.SERVER_ERROR,
    error?.message || message.SOMETHING_WENT_WRONG,
    errorObj
  );
};

export default errorhandler;
