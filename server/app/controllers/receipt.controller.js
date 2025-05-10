import db from '../models/index.js'

import { QueryTypes } from 'sequelize';

const Op = db.Sequelize.Op;
const Receipt = db.receipts;

const sequelize = db.sequelize;

export const create = (req, res) => {
    Receipt.create(receipt)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating Receipt."
            });
        });
};

export const findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Receipt.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Receipts."
            });
        });
};

export const findAllList = (req, res) => {
    const rIds = req.params.id;

    let query = `\
    SELECT receipts.*, \
    deliverables.id as dId, deliverables.partial, deliverables.num_pcs, \
    jobs.id as jobId, jobs.process, jobs.po_id, orders.po_num \
    FROM receipts \
    JOIN deliverables on deliverables.receipt_id=receipts.id \
    JOIN jobs on deliverables.job_id=jobs.id \
    JOIN orders on orders.id=jobs.po_id \
    WHERE receipts.id IN (${rIds});`;
    console.log(query);

    sequelize.query(query, { type: QueryTypes.SELECT })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving receipts."
            });
        });
}

export const findAllPO = (req, res) => {
    const poId = req.params.id;

    const query = `\
    SELECT receipts.id \
    FROM receipts \
    JOIN deliverables on deliverables.receipt_id=receipts.id \
    JOIN jobs on deliverables.job_id=jobs.id \
    WHERE jobs.po_id=${poId};`;

    sequelize.query(query, { type: QueryTypes.SELECT })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving receipts."
            });
        });
};

export const findAllSearch = (req, res) => {

    const customer = req.params.customer;
    const PO = req.params.PO;
    const DS = req.params.DS;

    const query = [];

    const query_base = "\
    SELECT receipts.*, \
    deliverables.id as dId, deliverables.partial, deliverables.num_pcs, \
    jobs.id as jobId, jobs.process, jobs.po_id, \
    orders.po_num, orders.customer \
    FROM receipts \
    JOIN deliverables ON deliverables.receipt_id = receipts.id \
    JOIN jobs ON jobs.id=deliverables.job_id \
    JOIN orders ON orders.id=jobs.po_id ";

    query.push(query_base);

    const conditions = [];
    const c1 = customer ? " orders.customer LIKE '%" + customer + "%' " : null;
    const c2 = PO ? " orders.po_num LIKE '%" + PO + "%' " : null;
    const c3 = DS ? " receipts.id LIKE '%" + DS + "%' " : null;
    conditions.push(c1, c2, c3);

    const query_conditions = [];

    conditions.forEach((c) => {
        if (c) query_conditions.push(c);
    })

    const string_WHERE = " WHERE ";
    if (query_conditions.length > 0) {
        query.push(string_WHERE);
        query.push(query_conditions[0]);
        query_conditions.splice(0,1);
    }

    const string_AND = " AND ";
    while (query_conditions.length > 0) {
        query.push(string_AND);
        query.push(query_conditions[0]);
        query_conditions.splice(0,1);
    }

    query.push(";");

    var query_string = "";
    query.forEach((str) => { query_string += str });

    console.log(query_string);

    sequelize.query( query_string, { type: QueryTypes.SELECT })
        .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "An error occurred while retrieving receipts."
                });
            });
};

export const findOne = (req, res) => {
    const id = req.params.id;

    Receipt.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Receipt with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Receipt with id=" + id
            });
        });
};

export const update = (req, res) => {
    const id = req.params.id;

    Receipt.update(req.body, { where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Receipt updated."
                });
            } else {
                res.send({
                    message: `Cannot update Receipt with id=${id}. Possible causes: not found or empty req.body.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Receipt with id=" + id
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.id;

    Receipt.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Receipt deleted."
                });
            } else {
                res.send({
                    message: `Cannot delete Receipt with id=${id}. Possible cause: not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Receipt with id=" + id
            });
        });
};