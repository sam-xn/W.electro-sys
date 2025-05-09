import * as orders from '../controllers/order.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", orders.create);
    router.get("/", orders.findAll);

    router.get("/:id", orders.findOne);
    router.put("/:id", orders.update);
    router.delete("/:id", orders.deleteOne);

    router.get("/status/:status", orders.findAllSearch);
    router.get("/status/:status/search/customer=:customer", orders.findAllSearch);
    router.get("/status/:status/search/PO=:PO", orders.findAllSearch);
    router.get("/status/:status/search/customer=:customer/PO=:PO", orders.findAllSearch);

    router.get("/search/customer=:customer", orders.findAllSearch);
    router.get("/search/PO=:PO", orders.findAllSearch);
    router.get("/search/customer=:customer/PO=:PO", orders.findAllSearch);
    
    app.use("/api/orders", router);
}