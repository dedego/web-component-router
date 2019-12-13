const split = str => {
  if (!str.includes("/")) return str;
  if (str.charAt(0) === "/") return str.substring(1).split("/");
  return str.split("/");
}

const matcher = (patterns, targetRoute) => {
  const exactMatch = patterns.find(({ path }) => path === targetRoute);
  const wildcard = patterns.find(pattern => pattern.path === '*');
  if (exactMatch) return { route: exactMatch, props: null };
  const targetParts = split(targetRoute);
  const props = {};
  const route = patterns.find(({ path }) => {
    const patternParts = split(path);

    if (!Array.isArray(patternParts)) {
      // patternParts is wildcard character
      return false;
    }

    if (patternParts[0].includes(":")) {
      // not allowed
      return false;
    }

    const requiredPartsLen = patternParts.filter(part => !part.includes(':?')).length;
    const fullPartsLen = patternParts.length;
    const targetPartsLen = targetParts.length;

    if (targetPartsLen < requiredPartsLen || targetPartsLen > fullPartsLen) {
      return false;
    }

    return patternParts.every((part, i) => {
      if (patternParts[i].includes(':?')) {
        props[patternParts[i].replace(':?', '')] = targetParts[i];
        return true;
      }
      if (patternParts[i].includes(':')) {
        props[patternParts[i].replace(':', '')] = targetParts[i];
        return true;
      }
      return part === targetParts[i];
    });
  });

  if(!route && wildcard) return { route: wildcard };
  if(!route && !wildcard) return null;
  return { route, props };
};

export default matcher;
export { matcher };
