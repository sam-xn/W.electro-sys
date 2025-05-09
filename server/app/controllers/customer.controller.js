import db from '../models/index.js'

const Op = db.Sequelize.Op;
const Customer = db.customers;

export const create = (req, res) => {
    if (!res.body.company_name) {
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    Customer.create(customer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating Customer."
            });
        });
};

export const findAll = (req, res) => {
    const company_name = req.query.company_name;
    const condition = company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : null;

    Customer.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Customers."
            });
        });
};

export const findOne = (req, res) => {
    const id = req.params.company_name;

    Customer.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Customer with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Customer with id=" + id
            });
        });
};

export const update = (req, res) => {
    const id = req.params.company_name;

    Customer.update(req.body, { where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Customer updated."
                });
            } else {
                res.send({
                    message: `Cannot update Customer with id=${id}. Possible causes: not found or empty req.body.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Customer with id=" + id
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.company_name;

    Customer.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Customer deleted."
                });
            } else {
                res.send({
                    message: `Cannot delete Customer with id=${id}. Possible cause: not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Customer with id=" + id
            });
        });
};