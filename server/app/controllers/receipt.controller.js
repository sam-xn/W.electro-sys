import db from '../models/index.js'

const Receipt = db.receipts;
const Deliverable = db.deliverables;
const Job = db.jobs;
const Op = db.Sequelize.Op;

export const createWithDeliverables = (req, res) => {

    if (!req.body || !req.body.deliverables) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Receipt.create({})
        .then(data => { res.send(data); return data[0]; })
        .then(receiptId => {
            req.body.deliverables.forEach( deliverable => {
                Deliverables.create({ partial: deliverable.partial, qty: deliverable.qty, job_id: deliverable.qty, receiptId: receiptId })
                    .then(data => { res.send(data); })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "An error occurred while creating Deliverable." });
                    });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while creating Receipt." });
        });
};

export const findOrder = (req, res) => {

    if (!req.params.po_id) {
        req.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Receipt.hasMany(Deliverable, { foreignKey: 'receipt_id' });
    Deliverable.belongsTo(Receipt, { foreignKey: 'receipt_id' });

    Deliverable.belongsTo(Job, { foreignKey: 'job_id' });
    Job.hasMany(Deliverable, { foreignKey: 'job_id' });
    
    Receipt.findAll({ include: [{ 
        model: Deliverable, required: false, right: true, attributes: [],
        include: [{
            model: Job, required: true, attributes: [], where: { po_id: req.params.po_id }
    }] }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const findList = (req, res) => {

    if (!req.body || !req.body.receiptIds) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Receipt.hasMany(Deliverable, { foreignKey: 'receipt_id' });
    Deliverable.belongsTo(Receipt, { foreignKey: 'receipt_id' });

    Deliverable.belongsTo(Job, { foreignKey: 'job_id' });
    Job.hasMany(Deliverable, { foreignKey: 'job_id' });

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Receipt.findAll({
        where: { id: { [Op.any]: req.body.receiptIds } },
        include: [{
            model: Deliverable, required: true, attributes: [],
            include: [{
                model: Job, required: true, attributes: [],
                include: [{
                    model: Orders, required: true, attributes: []
    }] }] }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Receipts." });
        });
}

export const search = (req, res) => {

    if (!req.body || !req.body.receiptIds) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    const receiptConditions = {};
    if (req.query.id) receiptConditions.id = { [Op.like]: `%${req.query.id}%` }

    const orderConditions = {};
    if (req.query.customer) orderConditions.customer = { [Op.like]: `%${req.query.customer}%` }
    if (req.query.po_num) orderConditions.po_num = { [Op.like]: `%${req.query.po_num}%` }

    Receipt.hasMany(Deliverable, { foreignKey: 'receipt_id' });
    Deliverable.belongsTo(Receipt, { foreignKey: 'receipt_id' });

    Deliverable.belongsTo(Job, { foreignKey: 'job_id' });
    Job.hasMany(Deliverable, { foreignKey: 'job_id' });

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Receipt.findAll({
        where: receiptConditions,
        include: [{
            model: Deliverable, required: true, attributes: [], 
            include: [{
                model: Job, required: true, attributes: [],
                include: [{
                    model: Orders, required: true, attributes: [], where: orderConditions,
    }] }] }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Receipts." });
        });
};

export const _delete = (req, res) => {
    Receipt.destroy({ where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "Receipt deleted." }); }
            else { res.send({ message: `Cannot delete Receipt with id=${req.params.id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Receipt with id=${req.params.id}` });
        });
};

