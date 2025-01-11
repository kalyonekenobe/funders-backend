export const configureCorsAllowedOriginsList = (
  corsAllowedOriginsString: string,
  delimiter: string = ',',
): string[] => {
  return corsAllowedOriginsString // The string of allowed origins separated by a delimiter
    .split(delimiter) // Split the string by a specified delimiter
    .filter(origin => origin) // Filter possible undefined values
    .map(origin => origin.trim()); // Remove the extreme empty spaces of received strings
};
