export default (sequelize, Sequelize) => {
    const Job = sequelize.define("job", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },
        status: { type: Sequelize.STRING(100), allowNull: false },

        author_initial: { type: Sequelize.STRING(100), allowNull: false },

        po_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' } },
        process: { type: Sequelize.STRING(100), allowNull: false },
        num_pcs: { type: Sequelize.STRING(100), allowNull: false },
        remarks: { type: Sequelize.TEXT },

        operator_initial: { type: Sequelize.STRING(100) },
        operator_notes: { type: Sequelize.STRING },
        diff_level: { type: Sequelize.INTEGER },
        rack_type: { type: Sequelize.STRING(100) },

        price: { type: Sequelize.DECIMAL(11, 10) },

        notes: { type: Sequelize.TEXT }
        });
    return Job;
}