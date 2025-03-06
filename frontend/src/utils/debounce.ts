export default function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timer;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
