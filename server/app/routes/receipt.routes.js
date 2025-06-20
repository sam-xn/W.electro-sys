import * as receipts from '../controllers/receipt.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", receipts.createWithDeliverables);

    router.get("/order/:poId", receipts.findOrder);
    router.get("/list/:receiptIds", receipts.findList);
    router.get("/search", receipts.search);
    router.get("/print/:id", receipts.findPrint);
    router.get("/deliverables/list/:jobIds", receipts.findDeliverablesList);

    router.delete("/:id", receipts._delete);

    app.use("/api/receipts", router);
}