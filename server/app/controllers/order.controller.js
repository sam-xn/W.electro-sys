import db from '../models/index.js'

import { QueryTypes } from 'sequelize';

const Op = db.Sequelize.Op;
const Order = db.orders;

const sequelize = db.sequelize;

export const create = (req, res) => {

    if (!req.body.poNum || !req.body.po_customer || !req.body.status) {
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    const customer = req.body.po_customer;
    const poNum = req.body.poNum;
    const status = req.body.status;

    const query = `\
    INSERT INTO orders(po_num, customer, status) \
    values(\'${poNum}\',\'${customer}\',\'${status}\');`;

    sequelize.query(query, { type: QueryTypes.INSERT })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Jobs."
            });
        });
};

export const findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Order.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Orders."
            });
        });
};

export const findAllSearch = (req, res) => {
    const customer = req.params.customer;
    const PO = req.params.PO;
    const status = req.params.status;

    const condition1 = customer ? { customer: { [Op.like]: `%${customer}%` } } : null;
    const condition2 = PO ? { po_num: { [Op.like]: `%${PO}%` } } : null;
    const condition3 = status ? { status: { [Op.like]: `%${status}%` } } : null;

    const condition = { [Op.and]: [condition1, condition2, condition3] };

    console.log(req.params);

    Order.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Orders."
            });
        });
};

export const findOne = (req, res) => {
    const id = req.params.id;

    Order.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Order with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Order with id=" + id
            });
        });
};

export const updateNotes = (req, res) => {
    const id = req.params.id;
    console.log(data);
    const query = `UPDATE orders SET notes=${data} WHERE id=${id};`;
    
    sequelize.query(query, { type: QueryTypes.UPDATE })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Jobs."
            });
        });
};

export const update = (req, res) => {
    const id = req.params.id;

    Order.update(req.body, { where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Order updated."
                });
            } else {
                res.send({
                    message: `Cannot update Order with id=${id}. Possible causes: not found or empty req.body.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Order with id=" + id
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.id;

    Order.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Order deleted."
                });
            } else {
                res.send({
                    message: `Cannot delete Order with id=${id}. Possible cause: not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Order with id=" + id
            });
        });
};