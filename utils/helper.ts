/**
 * Truncates a name to a specified length and adds ellipsis if needed
 * @param name The name to truncate
 * @param length The maximum length of the truncated name
 * @returns The truncated name
 */
export const nameTructed = (name: string, length: number): string => {
  if (!name) return "";
  return name.length > length ? `${name.substring(0, length)}...` : name;
};

/**
 * Trims text for display in a snackbar
 * @param text The text to trim
 * @returns The trimmed text
 */
export const trimSnackBarText = (text: string): string => {
  if (!text) return "";
  const maxLength = 52;
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};