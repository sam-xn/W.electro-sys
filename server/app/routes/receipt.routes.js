import * as receipts from '../controllers/receipt.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", receipts.create);
    router.get("/", receipts.findAllSearch);

    router.get("/:id", receipts.findOne);
    router.put("/:id", receipts.update);
    router.delete("/:id", receipts.deleteOne);

    router.get("/PO/id=:id", receipts.findAllPO);
    router.get("/PO/list/id=:id", receipts.findAllList);

    router.get("/search/customer=:customer", receipts.findAllSearch);
    router.get("/search/PO=:PO", receipts.findAllSearch);
    router.get("/search/DS=:DS", receipts.findAllSearch);
    router.get("/search/customer=:customer/PO=:PO", receipts.findAllSearch);
    router.get("/search/customer=:customer/DS=:DS", receipts.findAllSearch);
    router.get("/search/customer=:customer/PO=:PO/DS=:DS", receipts.findAllSearch);
    router.get("/search/PO=:PO/DS=:DS", receipts.findAllSearch);    

    app.use("/api/receipts", router);
}