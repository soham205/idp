'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('permissions', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			module: {
				type: Sequelize.STRING(300),
				allowNull: true
			},
			resource: {
				type: Sequelize.STRING(300),
				allowNull: false
			},
			method: {
				type: Sequelize.STRING(1000),
				allowNull: true
			},
			method: {
				type: Sequelize.STRING(1000),
				allowNull: true
			},
			displayMethod: {
				type: Sequelize.STRING,
				allowNull: false
			},
			group: {
				type: Sequelize.STRING,
				allowNull: false
			},
			enable: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: 0
			},
			createdAt: {
				field: 'createdAt',
				type: Sequelize.DATE
			},
			updatedAt: {
				field: 'updatedAt',
				type: Sequelize.DATE
			}
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('permissions');
	}
};
