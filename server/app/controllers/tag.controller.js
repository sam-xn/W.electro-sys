import db from '../models/index.js'

const Tag = db.tags;

export const create = (req, res) => {

    if (!req.body.jobId || !req.body.initial) {
        res.status(400).send({ message: "Content cannot be empty." });
        return;
    }

    Tag.create({ jobId: req.body.jobId, initial: req.body.initial, remarks: req.body.remarks })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "An error occurred while creating Tag." });
        });
};

export const finish = (req, res) => {
    Tag.update(
        {
            operator_initial: req.body.operator_initial,
            operator_notes: req.body.operator_notes,
            diff_level: req.body.diff_level,
            rack_type: req.body.rack_type,
            status: "processed"
        },
        { where: { jobId: req.params.jobId } }
    )
        .then(num => {
            if (num === 1) { res.send({ message: "Tag updated." }); }
            else { res.send({ message: `Cannot update Tag with id=${req.params.jobId}. Possible causes: not found or empty req.body.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Error updating Tag with id=${req.params.jobId}.` });
        });
};

export const _delete = (req, res) => {
    Tag.destroy({ where: { jobId: req.params.jobId } })
        .then(num => {
            if (num === 1) { res.send({ message: "Tag deleted." }); }
            else { res.send({ message: `Cannot delete Tag with id=${req.params.jobId}. Possible cause: not found.` }); }
        })
        .catch(err => {
            res.status(500).send({ message: `Could not delete Tag with id=${req.params.jobId}.` });
        });
};