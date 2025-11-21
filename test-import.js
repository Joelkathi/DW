console.log('Testing imports...');

async function test() {
  try {
    console.log('1. Importing auth middleware...');
    const auth = await import('./middleware/auth.js');
    console.log('Auth middleware:', Object.keys(auth));

    console.log('2. Importing admin route...');
    const adminRoutes = await import('./routes/admin.js');
    console.log('Admin routes:', Object.keys(adminRoutes));

    console.log('Success!');
  } catch (e) {
    console.error('Error:', e.message);
    console.error(e.stack);
  }
}

test();
