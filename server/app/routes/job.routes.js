import * as jobs from '../controllers/job.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", jobs.createWithTag);

    router.get("/order/:poId", jobs.findOrder);
    router.get("/customer/:status/:customer", jobs.findCustomer);
    router.get("/list/:jobIds", jobs.findList);
    router.get("/search/:status", jobs.search);

    router.get("/:id", jobs.findJob);

    //router.put("/:id", jobs.update);
    router.put("/tag/:id", jobs.updateTag);

    router.delete("/:id", jobs._delete);

    app.use("/api/jobs", router);
}