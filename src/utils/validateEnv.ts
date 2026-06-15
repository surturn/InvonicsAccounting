const REQUIRED: Record<string, string> = {
  DATABASE_URL:     'PostgreSQL connection string',
  JWT_SECRET:       'Secret key for signing JWTs (min 32 chars)',
  OPENAI_API_KEY:   'OpenAI API key for M-Pesa PDF parsing',
  FRONTEND_URL:     'CORS origin for the frontend',
  BREVO_SMTP_USER:  'Brevo SMTP username',
  BREVO_SMTP_KEY:   'Brevo SMTP password',
  MAIL_FROM:        'Sender email address',
  OWNER_EMAIL:      'Recipient for automated job emails',
};

export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const [key, description] of Object.entries(REQUIRED)) {
    if (!process.env[key]) {
      missing.push(`  ✗ ${key.padEnd(20)} — ${description}`);
    }
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    warnings.push('  ⚠ JWT_SECRET is less than 32 characters — use a longer secret in production');
  }
  if (jwtSecret === 'secret' || jwtSecret === 'changeme') {
    missing.push('  ✗ JWT_SECRET is set to an insecure default value');
  }

  if (warnings.length > 0) {
    console.warn('\nConfiguration warnings:');
    warnings.forEach(w => console.warn(w));
  }

  if (missing.length > 0) {
    console.error('\nFATAL: Server cannot start — missing required environment variables:');
    missing.forEach(m => console.error(m));
    console.error('\nCopy .env.example to .env and fill in all values.\n');
    process.exit(1);
  }
}
