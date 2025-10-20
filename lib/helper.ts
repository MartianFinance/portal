export function shorten(str: string, length = 4) {
  if (!str) return "";
  if (str.length <= length * 2) return str;
  return `${str.substring(0, length)}...${str.substring(str.length - length)}`;
}
