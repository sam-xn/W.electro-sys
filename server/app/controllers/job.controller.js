import db from '../models/index.js'

const Job = db.jobs;
const Tag = db.orders;
const Order = db.orders;
const Op = db.Sequelize.Op;

export const createWithTag = (req, res) => {

    if (!req.body.status || !req.body.po_id || !req.body.process || !req.body.qty || !req.body.author_initial ) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.create(req.body)
        .then(data => { res.send(data); })
        .then(response => {

            const values = { jobId: response.data.id, author_initial: req.body.author_initial };
            if (req.body.remarks) values.remarks = req.body.remarks;

            Tag.create({ values })
                .then(data => { res.send(data); })
                .catch(err => {
                    res.status(500).send({ message: err.message || "An error occurred while creating Contact." });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const findCustomer = (req, res) => {

    if (!req.params.customer || !req.params.status) {
        req.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Job.findAll({ include: [{ model: Order, required: true, attributes: [ ['id', 'orderId'], 'customer', 'po_num', ['status', 'orderStatus'] ] }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const findList = (req, res) => {

    if (!req.body || !req.body.jobIds) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Job.findAll({
        where: { id: { [Op.any]: req.body.jobIds } },
        include: [{ required: true, model: Order, attributes: [['id', 'orderId'], 'customer', 'po_num', ['status', 'orderStatus']], }]
    })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const findOrder = (req, res) => {

    if (!req.params.poId) {
        req.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.belongsTo(Order, { foreignKey: 'po_id' })
    Order.hasMany(Job, { foreignKey: 'po_id' })

    Job.findAll({
        where: { po_id: poId },
        include: [{ required: true, model: Order, attributes: [['id', 'orderId'], 'customer', 'po_num', ['status', 'orderStatus']], }]
    })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const search = (req, res) => {

    if (!req.params.status) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    const jobConditions = { status: req.params.status };
    if (req.query.process) jobConditions.process = { [Op.like]: `%${req.query.process}%` }

    const orderConditions = {};
    if (req.query.customer) orderConditions.customer = { [Op.like]: `%${req.query.customer}%` }
    if (req.query.po_num) orderConditions.po_num = { [Op.like]: `%${req.query.po_num}%` }

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Job.findAll({
        where: jobConditions,
        include: [{ 
            model: Order, attributes: [['id', 'orderId'], 'customer', 'po_num', ['status', 'orderStatus']],
            where: orderConditions 
        }]
    })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const update = (req, res) => {
    Job.update( req.body, { where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "Job updated." }); }
            else { res.send({ message: `Cannot Job Order with id=${req.params.id}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating Jib with id=${req.params.id}.` });
        });
};

export const _delete = (req, res) => {
    Job.destroy({ where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "Job deleted." }); }
            else { res.send({ message: `Cannot delete Job with id=${req.params.id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Job with id=${req.params.id}` });
        });
};
