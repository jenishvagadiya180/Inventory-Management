import express from "express";
const router = express.Router();
import { Product } from "../controllers/index.js";
import { message } from "../helper/index.js";
import { body, param } from "express-validator";

router.get(
  "/:sku/price-history",
  [param("sku").exists().withMessage(message.INVALID_SKU)],
  Product.getProductPriceHistoryBySKU
);
router.get("/search", Product.getProductList);
router.patch(
  "/bulk-update",
  [
    body("category").isMongoId().withMessage(message.INVLID_CATEGORY),
    body("percentageIncrease")
      .exists()
      .isInt()
      .withMessage(message.INVLID_PERCENTAGE),
  ],
  Product.updateProductQuantityInBulk
);
router.put(
  "/updatePrice",
  [
    body("productId").isMongoId().withMessage(message.INVALID_PRODUCT_ID),
    body("price").exists().isFloat().withMessage(message.INVALID_PRICE),
  ],
  Product.updateProductPrice
);

export default router;
