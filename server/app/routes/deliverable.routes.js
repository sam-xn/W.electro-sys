import * as deliverables from '../controllers/deliverable.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", deliverables.create);
    router.get("/", deliverables.findAll);

    router.get("/:id", deliverables.findOne);
    router.put("/:id", deliverables.update);
    router.delete("/:id", deliverables.deleteOne);

    //router.get("/", deliverables.); with search criteria
    //router.get("/receipt/:id", deliverables.findReceipt);

    app.use("/api/deliverables", router);
}