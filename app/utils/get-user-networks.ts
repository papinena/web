export function formatPostNetworks(str: string) {
  const [ig, fb] = str.split(";");
  const arr = [];
  if (ig)
    arr.push({
      label: ig,
      url: `https://www.instagram.com/${ig}`,
      social: "instagram",
    });
  if (fb)
    arr.push({
      label: fb,
      url: `https://www.facebook.com/${fb}`,
      social: "facebook",
    });

  return arr;
}
