import db from '../models/index.js'

const Customer = db.customers;
const Contact = db.contacts;

//export const create = (req, res) => {

//    if (!req.body.newCompany) {
//        res.status(400).send({ message: "Content cannot be empty." });
//        return;
//    }

//    Customer.create({ company: req.body.newCompany })
//        .then(data => { res.send(data); })
//        .catch(err => {
//            res.status(500).send({ message: err.message || "An error occurred while creating Customer." });
//        });
//};

export const createWithContact = (req, res) => {

    if (!req.body.company || !req.body.name|| !req.body.email) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Customer.create({ company: req.body.company })
        .then(data => {
            Contact.create(req.body)
                .then(() => { res.send(data); });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while creating Customer." });
        });
};

export const findAll = (req, res) => {
    Customer.findAll()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(400).send({ message: err.message || "An error occurred while retrieving customers."});
        });
};

export const _delete = (req, res) => {
    Customer.destroy({ where: { company: req.params.company } })
        .then(num => {
            if (num === 1) { res.send({ message: "Customer deleted." }); }
            else { res.send({ message: `Cannot delete Customer with company=${req.params.copmany}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Customer with company=${req.params.company}.` });
        });
};