import { Platform } from 'react-native';

export const Palette = {
  charcoal: '#222831',
  gunmetal: '#393E46',
  teal: '#00ADB5',
  cloud: '#EEEEEE',
} as const;

export const Colors = {
  light: {
    text: Palette.charcoal,
    background: Palette.cloud,
    tint: Palette.teal,
    icon: Palette.gunmetal,
    tabIconDefault: '#888B90',
    tabIconSelected: Palette.teal,
  },
  dark: {
    text: Palette.cloud,
    background: Palette.charcoal,
    tint: Palette.teal,
    icon: '#888B90',
    tabIconDefault: '#5A5E66',
    tabIconSelected: Palette.teal,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
