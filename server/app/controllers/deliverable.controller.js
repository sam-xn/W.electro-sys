import db from '../models/index.js'

const Deliverable = db.deliverables;

export const create = (req, res) => {

    if (!req.body || !req.body.partial || !req.body.qty || !req.body.job_id || !req.body.receipt_id) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Contact.create(req.body)
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while retrieving Jobs." });
        });
};

export const _delete = (req, res) => {
    Deliverable.destroy({ where: { id: req.params.id } })
        .then(num => {
            if (num === 1) { res.send({ message: "Deliverable deleted." }); }
            else { res.send({ message: `Cannot delete Deliverable with id=${req.params.id}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Deliverable with id=${req.params.id}` });
        });
};
