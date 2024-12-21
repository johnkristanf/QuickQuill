import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}


export const formatDate = (dateString: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    month: 'short',  // Abbreviated month name
    day: 'numeric',  // Numeric day
    year: 'numeric', // Full year
    hour: 'numeric', // Hour in 12-hour format
    minute: 'numeric', // Minute
    hour12: true, // Enable 12-hour clock
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  return formattedDate;
};