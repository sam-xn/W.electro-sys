export default (sequelize, Sequelize) => {
    const Customer = sequelize.define("customer", {
        company: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false }
    });
    return Customer;
}