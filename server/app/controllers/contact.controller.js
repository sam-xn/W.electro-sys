import db from '../models/index.js'

const Contact = db.contacts;
const Op = db.Sequelize.Op;

export const create = (req, res) => {
    if (!req.body.name || (!req.body.email && !req.body.phone)) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Contact.create(req.body)
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const update = (req, res) => {
    Contact.update( req.body, { where: { email: req.params.email } })
        .then(num => {
            if (num === 1) { res.send({ message: "Contact updated." }); }
            else { res.send({ message: `Cannot update Contact with id=${req.body.email}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating Contact with id=${req.body.email}` });
        });
};

export const _delete = (req, res) => {
    Contact.destroy({ where: { email: req.params.email } })
        .then(num => {
            if (num === 1) { res.send({ message: "Contact deleted." }); }
            else { res.send({ message: `Cannot delete Contact with id=${id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Contact with id=${email}` });
        });
};

export const findAll = (req, res) => {
    Contact.findAll()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving contacts." });
        });
};

export const findCompany = (req, res) => {
    Contact.findAll({ where: { company: req.params.company } })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving contacts." });
        });
};

export const findType = (req, res) => {
    Contact.findAll({ where: { type: req.params.type } })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving contacts." });
        });
};

export const searchCompany = (req, res) => {

    const conditions = {};
    if (req.params.type) conditions.type = req.params.type;
    if (req.query.company) conditions.company = { [Op.like]: `%${req.query.company}%` };

    Contact.findAll({ where: conditions })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Contacts." });
        });
};
