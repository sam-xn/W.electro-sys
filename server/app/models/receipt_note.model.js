export default (sequelize, Sequelize) => {
    const ReceiptNote = sequelize.define("receipt_note", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },

        content: { type: Sequelize.TEXT },
        status: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "new" },

        receipt_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'receipts', key: 'id' }, onUpdate:'cascade' }
    });
    return ReceiptNote;
}

