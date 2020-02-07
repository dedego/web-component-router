const split = str => {
  if (!str.includes("/")) return [str];
  if (str.charAt(0) === "/") return str.substring(1).split("/");
  return str.split("/");
};

const matcher = (patterns, targetRoute) => {
  const exactMatch = patterns.find(({ path }) => path === targetRoute);
  if (exactMatch) return { route: exactMatch, props: null };
  const wildcard = patterns.find(pattern => pattern.path === "*");
  const targetParts = split(targetRoute);
  const props = {};
  const route = patterns.find(({ path }) => {
    const patternParts = split(path);
    if (!Array.isArray(patternParts)) return false;
    const requiredLength = patternParts.filter(part => !part.includes(':?')).length;
    
    if (
      patternParts[0].includes(":") || 
      targetParts.length < requiredLength || 
      targetParts.length > patternParts.length
    ) {
      return false;
    }

    return patternParts.every((part, i) => {
      if (patternParts[i].includes(":?")) {
        props[patternParts[i].replace(":?", "")] = targetParts[i];
        return true;
      }
      if (patternParts[i].includes(":")) {
        props[patternParts[i].replace(":", "")] = targetParts[i];
        return true;
      }
      return part === targetParts[i];
    });
  });

  if (!route && wildcard) return { route: wildcard };
  if (!route && !wildcard) return null;
  return { route, props };
};

export default matcher;
export { matcher, split };
