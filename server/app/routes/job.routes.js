import * as jobs from '../controllers/job.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", jobs.create);
    router.get("/", jobs.findAllSearch);

    router.get("/:id", jobs.findOne);
    router.put("/:id", jobs.update);
    router.delete("/:id", jobs.deleteOne);

    router.get("/PO/id=:id", jobs.findAllPO);

    router.get("/status/:status", jobs.findAllSearch);
    router.get("/status/:status/search/customer=:customer", jobs.findAllSearch);
    router.get("/status/:status/search/PO=:PO", jobs.findAllSearch);
    router.get("/status/:status/search/process=:process", jobs.findAllSearch);
    router.get("/status/:status/search/customer=:customer/PO=:PO", jobs.findAllSearch);
    router.get("/status/:status/search/customer=:customer/process=:process", jobs.findAllSearch);
    router.get("/status/:status/search/customer=:customer/PO=:PO/process=:process", jobs.findAllSearch);
    router.get("/status/:status/search/PO=:PO/process=:process", jobs.findAllSearch);

    router.get("/search/customer=:customer", jobs.findAllSearch);
    router.get("/search/PO=:PO", jobs.findAllSearch);
    router.get("/search/process=:process", jobs.findAllSearch);
    router.get("/search/customer=:customer/PO=:PO", jobs.findAllSearch);
    router.get("/search/customer=:customer/process=:process", jobs.findAllSearch);
    router.get("/search/customer=:customer/PO=:PO/process=:process", jobs.findAllSearch);
    router.get("/search/PO=:PO/process=:process", jobs.findAllSearch);

    app.use("/api/jobs", router);
}