import * as receipts from '../controllers/receipt.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", receipts.createWithDeliverables);

    router.get("/orders/:poId", receipts.findOrder);
    router.get("/list", receipts.findList);
    router.get("/search", receipts.search);

    router.delete("/:id", receipts._delete);

    app.use("/api/receipts", router);
}