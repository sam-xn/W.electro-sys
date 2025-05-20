import db from '../models/index.js'

const Receipt = db.receipts;
const Deliverable = db.deliverables;
const Job = db.jobs;
const Order = db.orders;
const Op = db.Sequelize.Op;

export const createWithDeliverables = (req, res) => {

    if (!req.body.deliverables_data) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Receipt.create({})
        .then(data => {
            req.body.deliverables_data.forEach(d => {
                //console.log(data.dataValues.id)
                Deliverable.create({ receipt_id: data.id, partial: d.partial, qty: d.newQty, job_id: d.jobId })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "An error occurred while creating Deliverable." });
                    });
            })

            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while creating Receipt." });
        });
};

export const findOrder = (req, res) => {

    if (!req.params.poId) {
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
        attributes: ['id'],
        include: [{
            model: Deliverable, required: true, attributes: [],
            include: [{
                model: Job, required: true, attributes: [], where: { po_id: req.params.poId },
                include: [{
                    model: Order, required: true, attributes: []
    }] }] }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Receipts." });
        });
}

export const findList = (req, res) => {

    if (!req.params.receiptIds) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }
    const rIds = (String(req.params.receiptIds)).split(','); 

    Receipt.hasMany(Deliverable, { foreignKey: 'receipt_id' });
    Deliverable.belongsTo(Receipt, { foreignKey: 'receipt_id' });

    Deliverable.belongsTo(Job, { foreignKey: 'job_id' });
    Job.hasMany(Deliverable, { foreignKey: 'job_id' });

    Receipt.findAll({
        where: { id: { [Op.in]: rIds } },
        include: [{
            model: Deliverable, required: true, attributes: ['id', 'qty', 'partial'],
            include: [{
                model: Job, required: true, attributes: ['id', 'process', ['qty', 'qtyRcvd']],
                include: [{
                    model: Order, required: true, attributes: ['id', 'po_num']
    }] }] }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const search = (req, res) => {

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
        attributes: ['id','_timestamp'],
        where: receiptConditions, 
        include: [{
            model: Deliverable, required: true, attributes: ['job_id'],
            include: [{
                model: Job, required: true, attributes: ['po_id'],
                include: [{
                    model: Order, required: true, attributes: ['po_num', 'customer', 'status'], where: orderConditions,
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

