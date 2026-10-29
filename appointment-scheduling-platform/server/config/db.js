const mongoose = require('mongoose');
const dns = require('dns');

// Use reliable public DNS resolvers to handle SRV record lookups on all networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Fall back to system default if custom DNS cannot be set
}

/**
 * Connect to MongoDB using the URI specified in server/.env
 * Handles Atlas connection timeouts and IP whitelist configuration.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_scheduler';

  try {
    // Attempt connection to the configured MONGODB_URI
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (mongoUri.includes('mongodb+srv://')) {
      console.error('\n--------------------------------------------------------------');
      console.error('MongoDB Atlas IP Whitelist Notice:');
      console.error('Your current public IP is not yet whitelisted in MongoDB Atlas.');
      console.error('To connect to Atlas from this machine:');
      console.error('  1. Open https://cloud.mongodb.com/');
      console.error('  2. Click "Network Access" in the left sidebar under Security');
      console.error('  3. Click "+ ADD IP ADDRESS"');
      console.error('  4. Click "ALLOW ACCESS FROM ANYWHERE" (adds 0.0.0.0/0) and Confirm');
      console.error('--------------------------------------------------------------\n');

      // Attempt fallback to local instance so app remains operational
      try {
        console.log('Connecting to local MongoDB backup instance on port 27017...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/appointment_scheduler');
        console.log(`Local MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch (localError) {
        console.error('Local backup instance error:', localError.message);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;
