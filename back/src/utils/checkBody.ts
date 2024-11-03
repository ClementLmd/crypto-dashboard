export function checkBody(body: Record<string, unknown>, keys: string[]): boolean {
  return keys.every(
    (key) => Object.hasOwn(body, key) && body[key] != null && body[key]?.toString().trim() !== '',
  );
}
