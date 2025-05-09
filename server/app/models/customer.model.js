export default (sequelize, Sequelize) => {
    const Customer = sequelize.define("customer", {
        company: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
        primary_contact: { type: Sequelize.STRING(100), references: { model: 'contacts', key: 'email' } },
        secondary_contact: { type: Sequelize.STRING(100) },
        accounting_contact: { type: Sequelize.STRING(100) }
    });
    return Customer;
}