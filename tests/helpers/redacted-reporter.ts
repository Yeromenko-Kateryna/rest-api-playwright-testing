import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult } from '@playwright/test/reporter';

const redact = (value: string | undefined): string | undefined => {
  if (!value) {
    return value;
  }

  const token = process.env.GOREST_TOKEN;
  const withoutToken = token ? value.replaceAll(token, '[REDACTED]') : value;

  return withoutToken.replace(/(authorization:\s*bearer\s+)[^\s]+/gi, '$1[REDACTED]');
};

const redactError = (error: TestError): void => {
  error.message = redact(error.message);
  error.stack = redact(error.stack);
  error.snippet = redact(error.snippet);
  error.value = redact(error.value);

  if (error.cause) {
    redactError(error.cause);
  }
};

export default class RedactedReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onBegin(_: FullConfig, suite: Suite): void {
    console.log(`Running ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    for (const error of result.errors) {
      redactError(error);
    }

    if (result.status === 'passed') {
      this.passed += 1;
      return;
    }

    if (result.status === 'skipped') {
      this.skipped += 1;
      return;
    }

    this.failed += 1;
    console.error(`FAILED: ${test.titlePath().join(' › ')}`);
    for (const error of result.errors) {
      console.error(error.message ?? error.value ?? 'Unknown test error');
    }

    for (const attachment of result.attachments) {
      if (attachment.name === 'cleanup-failure' && attachment.body) {
        console.error(`Cleanup diagnostic: ${attachment.body.toString()}`);
      }
    }
  }

  onEnd(result: FullResult): void {
    console.log(`\n${this.passed} passed, ${this.failed} failed, ${this.skipped} skipped (${result.status})`);
  }
}
