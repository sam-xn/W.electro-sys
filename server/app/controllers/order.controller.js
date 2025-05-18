import db from '../models/index.js'

const Order = db.orders;
const Op = db.Sequelize.Op;

export const create = (req, res) => {
    if (!req.body.po_num || !req.body.customer || !req.body.status) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Order.create( req.body )
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Order." });
        });
};

export const find = (req, res) => {
    Order.findByPk(req.params.id)
        .then(data => {
            if (data) { res.send(data); }
            else { res.status(404).send({ message: `Cannot find Order with id=${req.params.id}.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error retrieving Order with id=${req.params.id}.` });
        });
};

export const search = (req, res) => {
    if (!req.params.status) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    const conditions = { status: req.params.status };

    if (req.query.customer) conditions.customer = { [Op.like]: `%${req.query.customer}%` }
    if (req.query.po_num) conditions.po_num = { [Op.like]: `%${req.query.po_num}%` }

    Order.findAll({ where: conditions })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Orders." });
        });
};

export const update = (req, res) => {
    Order.update( req.body, { where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "Order updated." }); }
            else { res.send({ message: `Cannot update Order with id=${req.params.id}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating Order with id=${req.params.id}.` });
        });
};

export const _delete = (req, res) => {
    Order.destroy({ where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "Order deleted." }); }
            else { res.send({ message: `Cannot delete Order with id=${req.params.id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Order with id=${req.params.id}` });
        });
};
