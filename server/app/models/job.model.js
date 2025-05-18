export default (sequelize, Sequelize) => {
    const Job = sequelize.define("job", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },
        status: { type: Sequelize.STRING(100), allowNull: false },

        po_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' } },
        process: { type: Sequelize.STRING(100), allowNull: false },
        qty: { type: Sequelize.STRING(100), allowNull: false },
        remarks: { type: Sequelize.TEXT },

        price: { type: Sequelize.DECIMAL(11, 10) }
    });
    return Job;
}