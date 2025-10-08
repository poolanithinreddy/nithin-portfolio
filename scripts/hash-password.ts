#!/usr/bin/env ts-node
/**
 * Hash an admin password using bcrypt.
 *
 * Usage:
 *   npx tsx scripts/hash-password.ts
 *
 * Then paste the hash into your .env.local:
 *   ADMIN_PASSWORD_HASH="<hash>"
 */

import * as readline from "readline";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const password = await new Promise<string>((resolve) => {
    rl.question("Enter admin password: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  if (!password || password.trim().length === 0) {
    console.error("\nError: Password cannot be empty.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("\nWarning: Password is shorter than 8 characters. Consider a stronger password.");
  }

  console.log("\nHashing password...\n");

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  console.log("Add this to your .env.local file:\n");
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log("\nKeep this hash secure and never commit it to version control.");
}

main().catch((error) => {
  console.error("Failed to hash password:", error);
  process.exit(1);
});
