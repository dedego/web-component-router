const split = str => {
    if (!str.includes("/")) return str;
    if (str.charAt(0) === "/") return str.substring(1).split("/");
    return str.split("/");
}

const matcher = (patterns, targetRoute) => {
  const exactMatch = patterns.find(({ path }) => path === targetRoute);
  if (exactMatch) return { route: exactMatch, props: null };
  const targetParts = split(targetRoute);
  const props = {};
  const route = patterns.find(({ path }) => {
    const patternParts = split(path);
    if( (patternParts.length !== targetParts.length) || patternParts[0].includes(":") ) return false;
    const matches = [];    
    patternParts.forEach((part, i) => {
        if (patternParts[i] && patternParts[i].includes(":")) {
            props[patternParts[i].replace(":", "")] = targetParts[i];
            matches.push(true);
        } else {
            matches.push(part === targetParts[i]);
        }
    });
    return matches.every(match => match === true);
  });

  if(!route) return null;
  return { route, props };
};

export default matcher;
export { matcher };
