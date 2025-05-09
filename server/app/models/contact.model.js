export default (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        email: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
        name: { type: Sequelize.STRING(100), allowNull: false },

        company_name: { type: Sequelize.STRING(100) },
        dept: { type: Sequelize.STRING(100) }
    });
    return Contact;
}