export const defaultRoles = {
	ROLE_PUBLIC: {
		name: 'public',
		description: 'This is default role. Every non-registered user will have the permissions of a public user.',
		slug: 'public'
	},

	ROLE_AUTHENTICATED: {
		name: 'authenticated',
		description:
			'This is default role given to registered user. Every registered user will have the permissions of an authenticated user.',
		slug: 'authenticated'
	},

	ROLE_PROPERTY_ADMIN: {
		name: 'property admin',
		description: 'This role is for property admin.',
		slug: 'property-admin'
	},

	ROLE_ADMIN: {
		name: 'admin',
		description: 'This role is for admin. Admin has CRU access to every table.',
		slug: 'admin'
	},

	ROLE_SUPER_ADMIN: {
		name: 'super admin',
		description: 'This role is for super admin. Super Admin has CRUD access to every table.',
		slug: 'super-admin'
	}
};

export const DEFAULT_ROLE_SLUG = 'authenticated';

