export default (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        email: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
        name: { type: Sequelize.STRING(100), allowNull: false },
        last: { type: Sequelize.STRING(100) },

        company: { type: Sequelize.STRING(100), references: { model: 'contacts', key: 'email' } },
        //dept: { type: Sequelize.STRING(100) },
        type: { type: Sequelize.STRING(100), defaultValue: 'primary' }
    });
    return Contact;
}