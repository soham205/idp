'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('roles', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: Sequelize.STRING(300),
				allowNull: false
			},
			slug: {
				type: Sequelize.STRING(300),
				allowNull: false,
				unique: true
			},
			description: {
				type: Sequelize.STRING(1000),
				allowNull: true
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

		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			fullName: {
				type: Sequelize.STRING(300),
				allowNull: false
			},
			email: {
				type: Sequelize.STRING(300),
				allowNull: false,
				unique: true
			},
			newEmail: {
				type: Sequelize.STRING(1000),
				allowNull: true
			},
			phoneNumber: {
				type: Sequelize.STRING(12),
				allowNull: true
			},
			newPhoneNumber: {
				type: Sequelize.STRING(12),
				allowNull: true
			},
			password: {
				type: Sequelize.STRING(1000),
				allowNull: true
			},
			avtarUrl: {
				type: Sequelize.STRING(1000),
				allowNull: true,
			},
			isPhoneConfirmed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			phoneOTP: {
				type: Sequelize.STRING(8),
				allowNull: true
			},
			isConfirmed: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			resetPasswordToken: {
				type: Sequelize.STRING(1000),
				allowNull: true
			},
			isPasswordReset: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
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

		await queryInterface.createTable('users_roles_mapping', {
			// id: {
			// 	type: Sequelize.INTEGER,
			// 	autoIncrement: true
			// },
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'users', // its table"s name, not object name
					key: 'id' // its column"s name
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			roleId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'roles', // its table"s name, not object name
					key: 'id' // its column"s name
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
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
		await queryInterface.dropTable('users_roles_mapping');
		await queryInterface.dropTable('users');
		await queryInterface.dropTable('roles');
	}
};
