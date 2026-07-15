import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viciousvex.app',
  appName: 'Vicious Vex',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
