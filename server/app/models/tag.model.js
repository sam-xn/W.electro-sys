export default (sequelize, Sequelize) => {
    const Tag = sequelize.define("tag", {
        jobId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'jobs', key: 'id' } }, // ==jobs.id

        author_initial: { type: Sequelize.STRING(100), allowNull: false },
        remarks: { type: Sequelize.TEXT },

        operator_initial: { type: Sequelize.STRING(100) },
        operator_notes: { type: Sequelize.STRING },
        diff_level: { type: Sequelize.INTEGER }, // 1 | 2 | 3 | 4
        rack_type: { type: Sequelize.STRING(100) }, // option1 | option2 | option3 --check this on monday
        });
    return Tag;
}