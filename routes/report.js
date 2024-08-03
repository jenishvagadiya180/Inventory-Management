import express from "express";
const router = express.Router();
import { Report } from "../controllers/index.js";

router.get("/inventory-value", Report.getInventoryValues);
router.get("/supplier-product-count", Report.getSupplierProductCount);

export default router;
