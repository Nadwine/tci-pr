export function sleepTimer(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
