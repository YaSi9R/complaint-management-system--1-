import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import NodeCache from "node-cache"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const otpCache = new NodeCache({ stdTTL: 300 }) // TTL = 5 mins
export default otpCache
