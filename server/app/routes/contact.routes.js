import * as contacts from '../controllers/contact.controller.js'
import express from 'express';

export default (app) => {
    let router = express.Router();

    router.post("/", contacts.create);
    router.get("/", contacts.findAll);

    //router.get("/company/:company", contacts.findAllCompany);
    router.get("/type/:type", contacts.findAllType);
    router.get("/type/:type/company/:company", contacts.findAllCompany);

    router.get("/:id", contacts.findOne);
    router.put("/:id", contacts.update);
    router.delete("/:id", contacts.deleteOne);

    //router.get("/", contacts.); with search criteria

    app.use("/api/contacts", router);
}