import { ref, watch, computed } from 'vue';
import { usePreferredDark } from '@vueuse/core';

// 定义主题类型（暂时只保留 Material You 主题）
const themes = {
  material: 'Material You'
};

// Material You 主题配置
const themeConfig = {
  material: {
    borderRadius: '16px',
    colors: {
      primary: '#6750A4',
      secondary: '#625B71',
      tertiary: '#7D5260',
      error: '#B3261E',
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
      onError: '#FFFFFF',
      stateLayerOpacity: {
        hover: '0.08',
        focus: '0.12',
        pressed: '0.12',
        dragged: '0.16'
      },
      elevation: {
        level0: '0px 0px 0px rgba(0,0,0,0)',
        level1: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
        level2: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
        level3: '0px 1px 3px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15)',
        level4: '0px 2px 3px rgba(0,0,0,0.3), 0px 6px 10px 4px rgba(0,0,0,0.15)',
        level5: '0px 4px 4px rgba(0,0,0,0.3), 0px 8px 12px 6px rgba(0,0,0,0.15)'
      },
      dark: {
        primary: '#D0BCFF',
        secondary: '#CCC2DC',
        tertiary: '#EFB8C8',
        error: '#F2B8B5',
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
        onError: '#601410',
        stateLayerOpacity: {
          hover: '0.08',
          focus: '0.12',
          pressed: '0.12',
          dragged: '0.16'
        },
        elevation: {
          level0: '0px 0px 0px rgba(0,0,0,0)',
          level1: '0px 1px 3px 1px rgba(0,0,0,0.25), 0px 1px 2px rgba(0,0,0,0.5)',
          level2: '0px 2px 6px 2px rgba(0,0,0,0.25), 0px 1px 2px rgba(0,0,0,0.5)',
          level3: '0px 4px 8px 3px rgba(0,0,0,0.25), 0px 1px 3px rgba(0,0,0,0.5)',
          level4: '0px 6px 10px 4px rgba(0,0,0,0.25), 0px 2px 3px rgba(0,0,0,0.5)',
          level5: '0px 8px 12px 6px rgba(0,0,0,0.25), 0px 4px 4px rgba(0,0,0,0.5)'
        }
      }
    }
  }
};

export function useTheme() {
  // 固定使用 Material You 主题
  const currentTheme = ref('material');
  const isDark = usePreferredDark();

  // 获取当前主题配置
  const currentThemeConfig = computed(() => {
    const config = themeConfig.material;
    return isDark.value ? {
      ...config,
      colors: {
        ...config.colors,
        ...config.colors.dark
      }
    } : config;
  });

  // 预留主题切换接口（当前不可用）
  function setTheme(theme) {
    console.log('主题切换功能暂时关闭，固定使用 Material You 主题');
    // 预留接口，不执行实际操作
  }

  return {
    themes,
    currentTheme,
    currentThemeConfig,
    isDark,
    setTheme
  };
}