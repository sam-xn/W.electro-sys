import * as contacts from '../controllers/contact.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", contacts.create);

    router.get("/:id", contacts.find);
    router.get("/company/:company", contacts.findCompany);
    router.get("/type/:type", contacts.findType);
    router.get("/search/:type", contacts.searchCompany);

    router.put("/:id", contacts.update);

    router.delete("/:id", contacts._delete);

    app.use("/api/contacts", router);
}