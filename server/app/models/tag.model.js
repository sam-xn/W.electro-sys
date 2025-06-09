export default (sequelize, Sequelize) => {
    const Tag = sequelize.define("tag", {
        jobId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'jobs', key: 'id' } }, // ==jobs.id

        author_initial: { type: Sequelize.STRING(100), allowNull: false },

        operator_initial: { type: Sequelize.STRING(100) },
        operator_notes: { type: Sequelize.STRING },
        diff_level: { type: Sequelize.STRING(100) },
        rack_type: { type: Sequelize.STRING(100) },
        quality: { type: Sequelize.STRING(100) }
    });
    return Tag;
}