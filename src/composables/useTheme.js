import { ref, watch, computed } from 'vue';
import { usePreferredDark } from '@vueuse/core';

// 定义主题类型
const themes = {
  material: 'Material You'
};

// 主题配置
const themeConfig = {
  material: {
    borderRadius: '16px',
    colors: {
      primary: '#6750A4',
      onPrimary: '#FFFFFF',
      primaryContainer: '#EADDFF',
      onPrimaryContainer: '#21005E',
      secondary: '#625B71',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#E8DEF8',
      onSecondaryContainer: '#1E192B',
      tertiary: '#7D5260',
      onTertiary: '#FFFFFF',
      tertiaryContainer: '#FFD8E4',
      onTertiaryContainer: '#370B1E',
      error: '#B3261E',
      onError: '#FFFFFF',
      errorContainer: '#F9DEDC',
      onErrorContainer: '#410E0B',
      background: '#FFFBFE',
      onBackground: '#1C1B1F',
      surface: '#FFFBFE',
      onSurface: '#1C1B1F',
      surfaceVariant: '#E7E0EC',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
      shadow: '#000000',
      scrim: '#000000',
      inverseSurface: '#313033',
      inverseOnSurface: '#F4EFF4',
      inversePrimary: '#D0BCFF',
      text: '#1C1B1F',
      elevation: {
        level1: '0px 1px 2px rgba(0,0,0,0.3)',
        level2: '0px 2px 4px rgba(0,0,0,0.3)',
        level3: '0px 4px 8px rgba(0,0,0,0.3)'
      },
      dark: {
        primary: '#D0BCFF',
        onPrimary: '#381E72',
        primaryContainer: '#4F378B',
        onPrimaryContainer: '#EADDFF',
        secondary: '#CCC2DC',
        onSecondary: '#332D41',
        secondaryContainer: '#4A4458',
        onSecondaryContainer: '#E8DEF8',
        tertiary: '#EFB8C8',
        onTertiary: '#492532',
        tertiaryContainer: '#633B48',
        onTertiaryContainer: '#FFD8E4',
        error: '#F2B8B5',
        onError: '#601410',
        errorContainer: '#8C1D18',
        onErrorContainer: '#F9DEDC',
        background: '#1C1B1F',
        onBackground: '#E6E1E5',
        surface: '#1C1B1F',
        onSurface: '#E6E1E5',
        surfaceVariant: '#49454F',
        onSurfaceVariant: '#CAC4D0',
        outline: '#938F99',
        outlineVariant: '#49454F',
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: '#E6E1E5',
        inverseOnSurface: '#313033',
        inversePrimary: '#6750A4',
        text: '#E6E1E5',
        elevation: {
          level1: '0px 1px 3px rgba(0,0,0,0.5)',
          level2: '0px 2px 6px rgba(0,0,0,0.5)',
          level3: '0px 4px 12px rgba(0,0,0,0.5)'
        }
      }
    }
  }
};

export function useTheme() {
  const currentTheme = ref('material');
  const isDark = usePreferredDark();
  const systemTheme = ref('material');

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
    systemTheme.value = 'material';
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
    isDark,
    setTheme
  };
}