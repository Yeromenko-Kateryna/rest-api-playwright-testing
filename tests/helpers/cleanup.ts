import type { APIRequestContext } from '@playwright/test';
import { getAuthHeaders } from './auth';

export async function cleanupUser(
  request: APIRequestContext,
  userId: number,
): Promise<Error | undefined> {
  try {
    const response = await request.delete(`users/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (response.status() !== 204) {
      return new Error(
        `Cleanup failed for test-created user ${userId}: expected 204, received ${response.status()}.`,
      );
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    return new Error(`Cleanup failed for test-created user ${userId}: ${details}`);
  }
}
