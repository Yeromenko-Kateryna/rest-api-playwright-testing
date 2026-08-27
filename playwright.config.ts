import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  preserveOutput: 'never',
  reporter: [['./tests/helpers/redacted-reporter.ts']],
  use: {
    baseURL: 'https://gorest.co.in/public/v2/',
  },
});
