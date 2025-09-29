import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.237250d03c1e4f618fd8400416b5debe',
  appName: 'ailonso-trackside-ai',
  webDir: 'dist',
  server: {
    url: 'https://237250d0-3c1e-4f61-8fd8-400416b5debe.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;