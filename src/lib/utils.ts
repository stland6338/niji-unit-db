import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  } catch {
    return dateString;
  }
}

export function sortByReading(items: { nameReading?: string; name: string }[]): typeof items {
  return items.sort((a, b) => {
    const aReading = a.nameReading || a.name;
    const bReading = b.nameReading || b.name;
    return aReading.localeCompare(bReading, 'ja');
  });
}