export default (sequelize, Sequelize) => {
    const OrderNote = sequelize.define("order_note", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },

        content: { type: Sequelize.TEXT, allowNull: false },
        status: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "new" },

        order_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onUpdate: 'cascade' },
    });
    return OrderNote;
}

