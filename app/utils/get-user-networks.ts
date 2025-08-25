export function formatPostNetworks(str: string) {
  const [ig, fb] = str.split(";");

  return [ig, fb];
}
