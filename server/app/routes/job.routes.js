import * as jobs from '../controllers/job.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", jobs.createWithTag);

    router.get("/customer/:status/:customer", jobs.findCustomer);
    router.get("/list", jobs.findList);
    router.get("/order/:poId", jobs.findOrder);
    router.get("/search/:status", jobs.search);

    router.put("/:id", jobs.update);

    router.delete("/:id", jobs._delete);

    app.use("/api/jobs", router);
}