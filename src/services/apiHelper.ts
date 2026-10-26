/**
 * Utility helper to simulate network delay for mock backend calls.
 * When plugging in a real backend, replace this and the service files with real fetch/axios calls.
 */
export const delay = <T>(data: T, ms: number = 400): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data === undefined) {
        resolve(undefined as unknown as T);
      } else {
        try {
          resolve(JSON.parse(JSON.stringify(data)));
        } catch {
          resolve(data);
        }
      }
    }, ms);
  });
};
