/**
 * Removes trailing slashes except for the string "/" which is returned as is
 * @param input pathname
 * @returns string
 */
export const removeTrailingSlash = (input: string): string =>
  input === "/" ? "/" : input.replace(/\/$/, "");
