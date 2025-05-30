export default (sequelize, Sequelize) => {
    const Receipt = sequelize.define("receipt", {
        id: { type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
        _timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: sequelize.literal("CURRENT_TIMESTAMP") },
        rcvd_by: { type: Sequelize.STRING(100) }
    });
    return Receipt;
}

