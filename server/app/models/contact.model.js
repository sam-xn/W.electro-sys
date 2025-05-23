export default (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

        email: { type: Sequelize.STRING(100) },
        name: { type: Sequelize.STRING(100), allowNull: false },
        phone: { type: Sequelize.STRING(100) },

        company: { type: Sequelize.STRING(100), references: { model: 'customers', key: 'company' }, onUpdate: 'cascade' },
        type: { type: Sequelize.STRING(100), defaultValue: 'primary' } // primary | accounting | other
    });
    return Contact;
}