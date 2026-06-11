/**
 * KezPos — Central Configuration
 * Edit this file to update links, versions, pricing, and metadata across the entire site.
 */
window.KEZPOS = {
  version: 'v1.0.9',
  email: 'kezposapp@gmail.com',

  pricing: {
    monthly: 800,
    currency: 'Ksh',
    period: '/month',
  },

  downloads: {
    apk: {
      label: 'Android APK',
      url: 'https://github.com/KezPos/KezPos/releases/download/v1.0.9/KezPos-v1.0.9.apk',
      size: '77 MB',
      badge: 'Android 8+',
    },
    windows: {
      label: 'Windows App',
      url: 'https://github.com/KezPos/KezPos/releases/download/v1.0.9/KezPos-v1.0.9-setup.exe',
      size: '35 MB',
      badge: 'Windows',
    },
  },

  social: {
    github: 'https://github.com/KezPos/KezPos',
    twitter: '',
    instagram: '',
  },

  nav: [
    { label: 'Home',     href: 'index.html' },
    { label: 'Features', href: 'features.html' },
    { label: 'Install',  href: 'install.html' },
    { label: 'Legal',    href: 'terms.html' },
  ],

  footer: [
    { label: 'Features', href: 'features.html' },
    { label: 'Install',  href: 'install.html' },
    { label: 'Terms',    href: 'terms.html' },
    { label: 'Privacy',  href: 'privacy.html' },
  ],
};

if (typeof module !== 'undefined') module.exports = KEZPOS;
