export default (sequelize, Sequelize) => {
    const Deliverable = sequelize.define("deliverable", { 
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        partial: { type: Sequelize.BOOLEAN, allowNull: false },
        num_pcs: { type: Sequelize.STRING(100), allowNull: false },

        job_id: { type: Sequelize.INTEGER, references: { model: 'jobs', key: 'id' } },
        receipt_id: { type: Sequelize.INTEGER, references: { model: 'receipts', key: 'id' } }
    });
    return Deliverable;
}