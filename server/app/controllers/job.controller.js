import db from '../models/index.js'

const Job = db.jobs;
const Tag = db.tags;
const Order = db.orders;
const Op = db.Sequelize.Op;

export const createWithTag = (req, res) => {

    if (!req.body.status || !req.body.author_initial || !req.body.po_id || !req.body.process || !req.body.qty ) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.create(req.body)
        .then(data => {
            Tag.create({ jobId: data.id, author_initial: req.body.author_initial })
                .then(data => { res.send(data); })
                .catch(err => {
                    res.status(500).send({ message: err.message || "An error occurred while creating Tag." });
                })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while creating Job." });
        })
};

export const findCustomer = (req, res) => {

    if (!req.params.status || !req.params.customer) {
        req.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Job.findAll({ where: { status: req.params.status }, include: [{ model: Order, required: true, where: { customer: req.params.customer } }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const findList = (req, res) => {

    if (!req.params.jobIds) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }
    const jIds = (String(req.params.jobIds)).split(','); 

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Job.findAll({ where: { id: { [Op.in]: jIds } }, include: [{ model: Order, required: true }] })
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
    Job.hasOne(Tag, { foreignKey: 'jobId' });
    Tag.belongsTo(Job, { foreignKey: 'jobId' });

    Job.findAll({ where: { po_id: req.params.poId }, include: [{ required: true, model: Order }, { model: Tag, required: true }] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const findJob = (req, res) => {

    if (!req.params.id) {
        req.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Job.belongsTo(Order, { foreignKey: 'po_id' })
    Order.hasMany(Job, { foreignKey: 'po_id' })

    Job.findAll({ where: { id: req.params.id }, include: [{ required: true, model: Order , attributes: ['po_num', 'customer']}] })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const search = (req, res) => {

    const jobConditions = {};
    if (req.params.status !== "all") {
        if (req.params.status === "delivered") jobConditions.status = { [Op.like]: `%${req.params.status}%` };
        else jobConditions.status = req.params.status;
    }
    if (req.query.process) jobConditions.process = { [Op.like]: `%${req.query.process}%` };

    const orderConditions = {};
    if (req.query.customer) orderConditions.customer = { [Op.like]: `%${req.query.customer}%` };
    if (req.query.po_num) orderConditions.po_num = { [Op.like]: `%${req.query.po_num}%` };

    Job.belongsTo(Order, { foreignKey: 'po_id' });
    Order.hasMany(Job, { foreignKey: 'po_id' });

    Job.findAll({
        where: jobConditions,
        include: [{ model: Order, where: orderConditions }]
    })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const update = (req, res) => {

    console.log(req.body)

    Job.update(req.body, { where: { id: req.params.id } })
        .then(num => {
            if (num[0] === 1) { res.send({ message: "Job updated." }); }
            else { res.send({ message: `Cannot update Job with id=${req.params.id}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating Job with id=${req.params.id}.` });
        });
};

export const updateTag = (req, res) => {

    const tag = req.body; 
    if (req.body.diff_level === '') tag.diff_level = 0;

    Tag.update(tag, { where: { jobId: req.params.id } } )
        .then(num => {
            Job.update({ status: "processed" }, { where: { id: req.params.id } })

            if (num === 1) { res.send({ message: "Tag updated." }); }
            else { res.send({ message: `Cannot update Tag with id=${req.params.id}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating Tag with id=${req.params.id}.` });
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
