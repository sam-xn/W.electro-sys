import db from '../models/index.js'

import { QueryTypes } from 'sequelize';

const Op = db.Sequelize.Op;
const Job = db.jobs;

const sequelize = db.sequelize;

export const findOne = (req, res) => {
    const id = req.params.id;

    const query = `\
    SELECT orders.po_num, orders.customer, \
    jobs.* \
    FROM jobs join orders on orders.id = jobs.po_id \
    WHERE jobs.id=${id};`;

    sequelize.query(query, { type: QueryTypes.SELECT })
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

export const findAllPO = (req, res) => {

    const poId = req.params.id;

    const query = `\
    SELECT jobs.id, jobs._timestamp, jobs.status, jobs.process, jobs.num_pcs, jobs.remarks, \
    orders.id as orderId, orders.customer, orders.po_num, orders.status as orderStatus \
    FROM jobs JOIN orders ON jobs.po_id=orders.id \
    WHERE jobs.po_id=${poId};`;

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

//export const findAll = (req, res) => {
//    const title = req.query.title;
//    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

//    Job.findAll({ where: condition })
//        .then(data => {
//            res.send(data);
//        })
//        .catch(err => {
//            res.status(500).send({
//                message:
//                    err.message || "An error occurred while retrieving Jobs."
//            });
//        });
//};

export const update = (req, res) => {
    const id = req.params.id;

    const initial = req.body.initial;
    const notes = req.body.notes;
    const diff_level = req.body.diff_level;
    const rack = req.body.rack;
    const status = "processed";

    const query = `\
    UPDATE jobs \
    SET status=${status}, operator_initial=\'${initial}\', operator_notes=\'${notes}\', diff_level=${diff_level}, rack_type=\'${rack}\' \
    WHERE id=${id};`;

    sequelize.query(query, { type: QueryTypes.UPDATE })
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

export const create = (req, res) => {

    console.log(req.body);
    const date = req.body.today;
    const status = req.body.status;
    const initial = req.body.initial;
    const po = req.body.poId;
    const process = req.body.process;
    const qty = req.body.qty;
    const remarks = req.body.remarks;

    if (!req.body.status ||
        !req.body.initial ||
        !req.body.poId ||
        !req.body.process ||
        !req.body.qty
    ) {
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    const query = `\
    INSERT INTO jobs(status, author_initial, po_id, process, num_pcs, remarks) \
    values(\'${status}\',\'${initial}\',${po},\'${process}\',\'${qty}\',\'${remarks}\');`;

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

    //Job.create(job)
    //    .then(data => {
    //        res.send(data);
    //    })
    //    .catch(err => {
    //        res.status(500).send({
    //            message:
    //                err.message || "An error occured while creating Job."
    //        });
    //    });
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