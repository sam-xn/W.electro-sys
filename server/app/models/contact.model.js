export default (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

        email: { type: Sequelize.STRING(100) },
        fname: { type: Sequelize.STRING(100), allowNull: false },
        lname: { type: Sequelize.STRING(100) },
        phone: { type: Sequelize.STRING(100) },

        company: { type: Sequelize.STRING(100), references: { model: 'customers', key: 'company' }, onUpdate: 'cascade' },
        type: { type: Sequelize.STRING(100), defaultValue: 'primary' } // primary | accounting | other
    });
    return Contact;
}