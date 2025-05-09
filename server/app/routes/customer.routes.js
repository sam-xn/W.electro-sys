import * as customers from '../controllers/customer.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", customers.create);
    router.get("/", customers.findAll);

    router.get("/:id", customers.findOne);
    router.put("/:id", customers.update);
    router.delete("/:id", customers.deleteOne);

    //router.get("/", customers.); with search criteria

    app.use("/api/customers", router);
}