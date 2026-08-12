import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error(
    "Usage: npm run generate-admin-hash 'your-password-here'"
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters long");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("\n✅ Bcrypt hash generated successfully!\n");
  console.log("Add this to your .env.local:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  console.log(
    "Note: Keep this hash secret and store it securely in production.\n"
  );
  process.exit(0);
});
