import db from '../models/index.js'

import { QueryTypes } from 'sequelize';

const Op = db.Sequelize.Op;
const Job = db.jobs;

const sequelize = db.sequelize;

export const create = (req, res) => {
    if (!res.body.author_initial ||
        !res.body.po_id ||
        !res.body.customer ||
        !res.body.process ||
        !res.body.num_pcs
    ) {
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    Job.create(job)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating Job."
            });
        });
};

export const findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Job.findAll({ where: condition })
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

export const findAllPO = (req, res) => {
    console.log(req.params);

    const poId = req.params.id;
    const query = `\
    SELECT jobs.id, jobs._timestamp, jobs.status, jobs.process, jobs.num_pcs, jobs.remarks, \
    orders.id as orderId, orders.customer, orders.po_num, orders.status as orderStatus \
    FROM jobs JOIN orders ON jobs.po_id=orders.id \
    WHERE jobs.po_id=${poId};`;

    //const query = `\
    //SELECT jobs.id, jobs._timestamp, jobs.status, jobs.process, jobs.num_pcs, jobs.remarks, \
    //orders.id as orderId, orders.customer, orders.po_num, orders.status, \
    //customers.*, contacts.name \
    //FROM jobs JOIN orders ON jobs.po_id = orders.id \
    //JOIN customers on orders.customer = customers.company \
    //JOIN contacts on contacts.email = customers.primary_contact\
    //WHERE jobs.po_id=${poId};`;

    sequelize.query(query, { type: QueryTypes.SELECT })
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

export const findAllSearch = (req, res) => {
    
    console.log(req.params);
    
    const customer = req.params.customer;
    const PO = req.params.PO;
    const process = req.params.process;
    const status = req.params.status;

    const query = [];

    const query_base = "\
    SELECT jobs.id, jobs._timestamp, jobs.process, jobs.num_pcs, jobs.status, \
    orders.id as orderId, orders.customer, orders.po_num, orders.status \
    FROM jobs JOIN orders ON \
    jobs.po_id=orders.id ";

    query.push(query_base);

    const conditions = [];
    const c1 = customer ? " orders.customer LIKE '%" + customer + "%' " : null;
    const c2 = PO ? " orders.po_num LIKE '%" + PO + "%' " : null;
    const c3 = process ? " jobs.process LIKE '%" + process + "%' " : null;
    const c4 = status ? " jobs.status LIKE '%" + status + "%' " : null;
    conditions.push(c1, c2, c3, c4);

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

    sequelize.query( query_string, { type: QueryTypes.SELECT })
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

export const findOne = (req, res) => {
    const id = req.params.id;

    Job.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Job with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Job with id=" + id
            });
        });
};

export const update = (req, res) => {
    const id = req.params.id;

    Job.update(req.body, { where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Job updated."
                });
            } else {
                res.send({
                    message: `Cannot update Job with id=${id}. Possible causes: not found or empty req.body.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Job with id=" + id
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.id;

    Job.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Job deleted."
                });
            } else {
                res.send({
                    message: `Cannot delete Job with id=${id}. Possible cause: not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Job with id=" + id
            });
        });
};