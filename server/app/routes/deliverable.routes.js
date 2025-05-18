import * as deliverables from '../controllers/deliverable.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", deliverables.create);

    router.delete("/:id", deliverables._delete);

    app.use("/api/deliverables", router);
}