export default function stringToBoolean(stringData: string | null): boolean | undefined {
  if (stringData === "true") {
    return true;
  }
  if (stringData === "false") {
    return false;
  }
  // if nothing was satisfied return
  return undefined;
}
