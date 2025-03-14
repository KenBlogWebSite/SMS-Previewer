import { ref, watch, computed } from 'vue';
import { usePreferredDark } from '@vueuse/core';

// 定义主题类型
const themes = {
  auto: '自动',
  harmony: '鸿蒙',
  material: 'Material You',
  ios: 'iOS'
};

// 主题配置
const themeConfig = {
  harmony: {
    borderRadius: '16px',
    colors: {
      primary: '#007DFF',
      secondary: '#36D1DC',
      background: '#F1F3F5',
      surface: '#FFFFFF',
      text: '#000000',
      dark: {
        primary: '#007DFF',
        secondary: '#36D1DC',
        background: '#1A1A1A',
        surface: '#2C2C2C',
        text: '#FFFFFF'
      }
    }
  },
  material: {
    borderRadius: '16px',
    colors: {
      primary: '#6750A4',
      secondary: '#625B71',
      tertiary: '#7D5260',
      background: '#FFFBFE',
      surface: '#FFFFFF',
      surfaceVariant: '#E7E0EC',
      surfaceDim: '#DED8E1',
      surfaceBright: '#FFFBFF',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F7F2FA',
      surfaceContainer: '#F3EDF7',
      surfaceContainerHigh: '#ECE6F0',
      surfaceContainerHighest: '#E6E0E9',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
      text: '#1C1B1F',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onTertiary: '#FFFFFF',
      onSurface: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      stateLayerOpacity: {
        hover: '0.08',
        focus: '0.12',
        pressed: '0.12',
        dragged: '0.16'
      },
      elevation: {
        level1: '0px 1px 2px rgba(0,0,0,0.3)',
        level2: '0px 2px 4px rgba(0,0,0,0.3)',
        level3: '0px 4px 8px rgba(0,0,0,0.3)'
      },
      dark: {
        primary: '#D0BCFF',
        secondary: '#CCC2DC',
        tertiary: '#EFB8C8',
        background: '#1C1B1F',
        surface: '#141218',
        surfaceVariant: '#49454F',
        surfaceDim: '#141218',
        surfaceBright: '#3B383E',
        surfaceContainerLowest: '#0F0D13',
        surfaceContainerLow: '#1D1B20',
        surfaceContainer: '#211F26',
        surfaceContainerHigh: '#2B2930',
        surfaceContainerHighest: '#36343B',
        outline: '#938F99',
        outlineVariant: '#444746',
        text: '#E6E1E5',
        onPrimary: '#381E72',
        onSecondary: '#332D41',
        onTertiary: '#492532',
        onSurface: '#E6E1E5',
        onSurfaceVariant: '#CAC4D0',
        stateLayerOpacity: {
          hover: '0.08',
          focus: '0.12',
          pressed: '0.12',
          dragged: '0.16'
        },
        elevation: {
          level1: '0px 1px 3px rgba(0,0,0,0.5)',
          level2: '0px 2px 6px rgba(0,0,0,0.5)',
          level3: '0px 4px 12px rgba(0,0,0,0.5)'
        }
      }
    }
  },
  ios: {
    borderRadius: '12px',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: '#000000',
      dark: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        background: '#000000',
        surface: '#1C1C1E',
        text: '#FFFFFF'
      }
    }
  }
};

export function useTheme() {
  const currentTheme = ref('auto');
  const isDark = usePreferredDark();
  const systemTheme = ref(isDark.value ? 'material' : 'harmony');

  // 获取当前实际使用的主题
  const activeTheme = computed(() => {
    return currentTheme.value === 'auto' ? systemTheme.value : currentTheme.value;
  });

  // 获取当前主题配置
  const currentThemeConfig = computed(() => {
    const config = themeConfig[activeTheme.value];
    return isDark.value ? {
      ...config,
      colors: {
        ...config.colors.dark
      }
    } : config;
  });

  // 监听系统主题变化
  watch(isDark, (newValue) => {
    systemTheme.value = newValue ? 'material' : 'harmony';
  });

  // 切换主题
  function setTheme(theme) {
    if (themes[theme]) {
      currentTheme.value = theme;
    }
  }

  return {
    themes,
    currentTheme,
    activeTheme,
    currentThemeConfig,
    setTheme
  };
}