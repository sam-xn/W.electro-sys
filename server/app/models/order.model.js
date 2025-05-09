export default (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },

        customer: { type: Sequelize.STRING(100), allowNull: false, references: { model: 'customers', key: 'company' } },
        po_num: { type: Sequelize.STRING(100), allowNull: false },
        status: { type: Sequelize.STRING(100), allowNull: false },

        notes: { type: Sequelize.TEXT }
    });
    return Order;
}