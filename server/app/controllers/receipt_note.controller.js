import db from '../models/index.js'

const ReceiptNote = db.receipt_notes;
const Op = db.Sequelize.Op;

export const create = (req, res) => {

    if (!req.body.order_id) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    ReceiptNote.create(req.body)
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Notes." });
        });
};

export const findOrder = (req, res) => {
    ReceiptNote.findAll({ where: { order_id: req.params.poId } })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving notes." });
        });
};

export const findStatus = (req, res) => {
    OrderNote.findAll({ where: { status: req.params.status } })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving notes." });
        });
};

export const search = (req, res) => {

    if (!req.query.company && !req.query.receiptId) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    const conditions = {};
    if (req.query.company) conditions.company = { company: { [Op.like]: `%${req.query.company}%` } }
    if (req.query.receiptId) conditions.receipt_id = { company: { [Op.like]: `%${req.query.receiptId}%` } }

    ReceiptNote.findAll({ where: conditions })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Notes." });
        });
};

export const update = (req, res) => {
    ReceiptNote.update(req.body, { where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "ReceiptNote updated." }); }
            else { res.send({ message: `Cannot update ReceiptNote with id=${req.body.email}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating ReceiptNote with id=${req.body.email}` });
        });
};

export const _delete = (req, res) => {
    ReceiptNote.destroy({ where: { email: req.params.email } })
        .then(num => {
            if (num === 1) { res.send({ message: "ReceiptNote deleted." }); }
            else { res.send({ message: `Cannot delete ReceiptNote with id=${id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete ReceiptNote with id=${email}` });
        });
};
