import User from '../models/User';

export const createAdminUser = async (): Promise<void> => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = await User.create({
      email: 'admin@efforteducation.com',
      password: 'admin123456', // Change this in production
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      emailVerified: true,
    });

    console.log('Default admin user created:', {
      email: adminUser.email,
      password: 'admin123456', // Remove this in production
      role: adminUser.role,
    });

    console.log('⚠️  IMPORTANT: Change the default admin password in production!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
