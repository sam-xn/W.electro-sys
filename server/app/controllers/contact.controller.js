import db from '../models/index.js'

const Op = db.Sequelize.Op;
const Contact = db.contacts;

export const create = (req, res) => {
    if (!res.body.email || !res.body.name) {
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    Contact.create(contact)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating Contact."
            });
        });
};
    
export const findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Contact.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Contacts."
            });
        });
};

export const findOne = (req, res) => {
    const id = req.params.id;

    Contact.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Contact with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Contact with id=" + id
            });
        });
};

export const update = (req, res) => {
    const id = req.params.id;

    Contact.update(req.body, { where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Contact updated."
                });
            } else {
                res.send({
                    message: `Cannot update Contact with id=${id}. Possible causes: not found or empty req.body.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Contact with id=" + id
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.id;

    Contact.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Contact deleted."
                });
            } else {
                res.send({
                    message: `Cannot delete Contact with id=${id}. Possible cause: not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Contact with id=" + id
            });
        });
};