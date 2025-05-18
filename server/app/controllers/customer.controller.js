import db from '../models/index.js'

const Customer = db.customers;
const Contact = db.contacts;

export const createFromPO = (req, res) => {

    if (!req.body.company || !req.body.fname || !req.body.email) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Customer.create( req.body )
        .then(data => { res.send(data); })
        .then((data) => {
            Contact.create({ company: req.body.company, fname: req.body.fname, lname: req.body.lname, email: req.body.email, phone: req.body.phone })
                .then(data => { res.send(data); })
                .catch(err => {
                    res.status(500).send({ message: err.message || "An error occurred while creating Contact." });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while creating Customer." });
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