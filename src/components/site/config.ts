export const KEZPOS = {
  version: "v1.2.0",
  email: "kezposapp@gmail.com",
  whatsapp: "254745105755",
  plans: [
    { name: "Starter", months: 1, price: 700, comment: "Try it risk-free. Cancel anytime, no questions asked." },
    { name: "3 months", months: 3, price: 1700, comment: "Best for growing shops. Skip the monthly hassle." },
    { name: "Pro", months: 12, price: 6700, comment: "Lock in a year and forget about billing." },
  ],
  downloads: [
    { platform: "Android", label: "Download APK", url: "https://github.com/KezPos/KezPos/releases/download/v1.2.0/KezPos-v1.2.0.apk", size: "36 MB", requirement: "Android 8+" },
    { platform: "Windows", label: "Download for Windows", url: "https://github.com/KezPos/KezPos/releases/download/v1.2.0/KezPos-v1.2.0-setup.exe", size: "35 MB", requirement: "Windows" },
  ],
} as const;

export function pageHead(title: string, description: string) {
  return { meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] };
}