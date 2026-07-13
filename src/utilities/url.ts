/**
 * Appends an encoded query-string parameter to a URL.
 *
 * @param url - URL to update
 * @param name - Query-string parameter name
 * @param value - Query-string parameter value
 * @returns The URL with the query-string parameter appended
 */
export const appendQueryParam = (
  url: string,
  name: string,
  value: string | number | boolean,
): string => {
  const fragmentIndex = url.indexOf("#");
  const baseUrl = fragmentIndex === -1 ? url : url.slice(0, fragmentIndex);
  const fragment = fragmentIndex === -1 ? "" : url.slice(fragmentIndex);
  const separator = baseUrl.includes("?")
    ? baseUrl.endsWith("?") || baseUrl.endsWith("&")
      ? ""
      : "&"
    : "?";
  const queryParam = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`;
  return `${baseUrl}${separator}${queryParam}${fragment}`;
};
