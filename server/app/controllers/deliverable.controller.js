import db from '../models/index.js'

const Op = db.Sequelize.Op;
const Deliverable = db.deliverables;

export const create = (req, res) => {
    if (!res.body.job_id || !res.body.partial || !num_pcs) {
        res.status(400).send({
            message: "Content cannot be empty."
        });
        return;
    }

    Deliverable.create(deliverable)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occured while creating Deliverable."
            });
        });
};

export const findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Deliverable.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving Deliverables."
            });
        });
};

export const findOne = (req, res) => {
    const id = req.params.id;

    Deliverable.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Deliverable with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Deliverable with id=" + id
            });
        });
};

export const update = (req, res) => {
    const id = req.params.id;

    Deliverable.update(req.body, { where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Deliverable updated."
                });
            } else {
                res.send({
                    message: `Cannot update Deliverable with id=${id}. Possible causes: not found or empty req.body.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Deliverable with id=" + id
            });
        });
};

export const deleteOne = (req, res) => {
    const id = req.params.id;

    Deliverable.destroy({ where: { id: id } })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Deliverable deleted."
                });
            } else {
                res.send({
                    message: `Cannot delete Deliverable with id=${id}. Possible cause: not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Deliverable with id=" + id
            });
        });
};