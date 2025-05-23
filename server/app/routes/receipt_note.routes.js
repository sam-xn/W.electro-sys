import * as receipt_notes from '../controllers/receipt_note.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", receipt_notes.create);

    router.get("/order/:poId", receipt_notes.findOrder);
    router.get("/status/:status", receipt_notes.findStatus);
    router.get("/search", receipt_notes.search);

    router.put("/:id", receipt_notes.update);

    router.delete("/:id", receipt_notes._delete);

    app.use("/api/receipt_notes", router);
}