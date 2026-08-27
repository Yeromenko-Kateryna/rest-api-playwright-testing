export function getAuthHeaders(): { Authorization: string } {
  const token = process.env.GOREST_TOKEN;

  if (!token) {
    throw new Error('GOREST_TOKEN is not configured');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
