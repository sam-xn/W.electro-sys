import * as orders from '../controllers/order.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", orders.create);

    router.get("/:id", orders.find);
    router.get("/search/:status", orders.search);

    router.put("/:id", orders.update);
    router.delete("/:id", orders._delete);
    
    app.use("/api/orders", router);
}