/**
 * KezPos — Central Configuration
 * Edit this file to update links, versions, and metadata across the entire site.
 */
 window.KEZPOS = {
  version: 'v1.0.0',
  email: 'kezposapp@gmail.com',

  downloads: {
    apk: {
      label: 'Android APK',
      url: '',
      size: '18 MB',
      badge: 'Android 8+',
    },
    windows: {
      label: 'Windows App',
      url: 'https://github.com/KezPos/KezPos/releases/download/v1.0.0/KezPos-v1.0.0-setup.exe',
      size: '42 MB',
      badge: 'Windows 10/11',
    },
  },

  social: {
    github: 'https://github.com/KezPos/KezPos',
    twitter: '',       // add when ready
    instagram: '',     // add when ready
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

// Make globally available
if (typeof module !== 'undefined') module.exports = KEZPOS;
