export function formatMetadata<T extends Record<string, string>>(raw: string) {
  return raw.split(";").reduce<T>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) {
      Object.assign(acc, { [key]: value });
    }
    return acc;
  }, {} as T);
}
