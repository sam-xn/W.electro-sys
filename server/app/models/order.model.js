export default (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },

        po_num: { type: Sequelize.STRING(100), allowNull: false },
        status: { type: Sequelize.STRING(100), allowNull: false },
        customer: { type: Sequelize.STRING(100), allowNull: false, references: { model: 'customers', key: 'company' }, onUpdate: 'cascade' },
    });
    return Order;
}