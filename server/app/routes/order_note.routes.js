import * as order_notes from '../controllers/order_note.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", order_notes.create);

    router.get("/order/:poId", order_notes.findOrder);
    router.get("/status/:status", order_notes.findStatus);
    router.get("/search", order_notes.search);

    router.put("/:id", order_notes.update);

    router.delete("/:id", order_notes._delete);

    app.use("/api/order_notes", router);
}