  import db from '../models/index.js'

const OrderNote = db.order_notes;
const Op = db.Sequelize.Op;

export const create = (req, res) => {
    if (!req.body.order_id) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    OrderNote.create( req.body )
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Notes." });
        });
};

export const findOrder = (req, res) => {
    OrderNote.findAll({ where: { order_id: req.params.poId } })
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

    if (!req.query.company && !req.query.poId) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    const conditions = {};
    if (req.query.company) conditions.company = { company: { [Op.like]: `%${req.query.company}%` } }
    if (req.query.poId) conditions.order_id = { company: { [Op.like]: `%${req.query.poId}%` } }

    OrderNote.findAll({ where: conditions })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Notes." });
        });
};

export const update = (req, res) => {
    OrderNote.update( req.body, { where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "OrderNote updated." }); }
            else { res.send({ message: `Cannot update OrderNote with id=${req.params.id}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating OrderNote with id=${req.params.id}` });
        });
};

export const _delete = (req, res) => {
    OrderNote.destroy({ where: { email: req.params.email } })
        .then(num => {
            if (num === 1) { res.send({ message: "OrderNote deleted." }); }
            else { res.send({ message: `Cannot delete OrderNote with id=${id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete OrderNote with id=${email}` });
        });
};
