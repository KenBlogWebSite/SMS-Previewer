import { ref, watch, computed } from 'vue';
import { usePreferredDark } from '@vueuse/core';

// 定义主题类型
const themes = {
  material: 'Material You',
  dynamic: 'Dynamic Colors'
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
      // 新增 Material Design 3 的表面色调
      surfaceDim: '#DED8E1',
      surfaceBright: '#FFFBFF',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F7F2FA',
      surfaceContainer: '#F3EDF7',
      surfaceContainerHigh: '#ECE6F0',
      surfaceContainerHighest: '#E6E0E9',
      // 新增 Material Design 3 的状态层
      stateLayerOpacity: {
        hover: '0.08',
        focus: '0.12',
        pressed: '0.12',
        dragged: '0.16',
      },
      elevation: {
        level1: '0px 1px 2px rgba(0,0,0,0.3)',
        level2: '0px 2px 4px rgba(0,0,0,0.3)',
        level3: '0px 4px 8px rgba(0,0,0,0.3)',
        level4: '0px 6px 10px rgba(0,0,0,0.3)',
        level5: '0px 8px 12px rgba(0,0,0,0.3)'
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
        // 新增 Material Design 3 的表面色调 - 深色模式
        surfaceDim: '#141218',
        surfaceBright: '#3B383E',
        surfaceContainerLowest: '#0F0D13',
        surfaceContainerLow: '#1D1B20',
        surfaceContainer: '#211F26',
        surfaceContainerHigh: '#2B2930',
        surfaceContainerHighest: '#36343B',
        // 状态层不变
        elevation: {
          level1: '0px 1px 3px rgba(0,0,0,0.5)',
          level2: '0px 2px 6px rgba(0,0,0,0.5)',
          level3: '0px 4px 12px rgba(0,0,0,0.5)',
          level4: '0px 6px 16px rgba(0,0,0,0.5)',
          level5: '0px 8px 20px rgba(0,0,0,0.5)'
        }
      }
    }
  },
  // 新增动态颜色主题
  dynamic: {
    borderRadius: '24px',
    colors: {
      // 基础颜色 - 浅色模式
      primary: '#006874',
      onPrimary: '#FFFFFF',
      primaryContainer: '#A2EEFF',
      onPrimaryContainer: '#001F24',
      secondary: '#4A6267',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#CDE7EC',
      onSecondaryContainer: '#051F23',
      tertiary: '#525E7D',
      onTertiary: '#FFFFFF',
      tertiaryContainer: '#DAE2FF',
      onTertiaryContainer: '#0E1B37',
      error: '#BA1A1A',
      onError: '#FFFFFF',
      errorContainer: '#FFDAD6',
      onErrorContainer: '#410002',
      background: '#FAFDFD',
      onBackground: '#191C1D',
      surface: '#FAFDFD',
      onSurface: '#191C1D',
      surfaceVariant: '#DBE4E6',
      onSurfaceVariant: '#3F484A',
      outline: '#6F797A',
      outlineVariant: '#BFC8CA',
      shadow: '#000000',
      scrim: '#000000',
      inverseSurface: '#2E3132',
      inverseOnSurface: '#EFF1F1',
      inversePrimary: '#52D7F0',
      text: '#191C1D',
      // 新增 Material Design 3 的表面色调
      surfaceDim: '#D8DBDC',
      surfaceBright: '#FAFDFD',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F2F4F4',
      surfaceContainer: '#ECEEEF',
      surfaceContainerHigh: '#E6E8E9',
      surfaceContainerHighest: '#E0E3E3',
      // 状态层
      stateLayerOpacity: {
        hover: '0.08',
        focus: '0.12',
        pressed: '0.12',
        dragged: '0.16',
      },
      elevation: {
        level1: '0px 1px 2px rgba(0,0,0,0.3)',
        level2: '0px 2px 4px rgba(0,0,0,0.3)',
        level3: '0px 4px 8px rgba(0,0,0,0.3)',
        level4: '0px 6px 10px rgba(0,0,0,0.3)',
        level5: '0px 8px 12px rgba(0,0,0,0.3)'
      },
      // 深色模式颜色
      dark: {
        primary: '#52D7F0',
        onPrimary: '#00363D',
        primaryContainer: '#004F58',
        onPrimaryContainer: '#A2EEFF',
        secondary: '#B1CBD0',
        onSecondary: '#1C3438',
        secondaryContainer: '#334B4F',
        onSecondaryContainer: '#CDE7EC',
        tertiary: '#BBC6EA',
        onTertiary: '#24304D',
        tertiaryContainer: '#3B4664',
        onTertiaryContainer: '#DAE2FF',
        error: '#FFB4AB',
        onError: '#690005',
        errorContainer: '#93000A',
        onErrorContainer: '#FFDAD6',
        background: '#191C1D',
        onBackground: '#E1E3E3',
        surface: '#191C1D',
        onSurface: '#E1E3E3',
        surfaceVariant: '#3F484A',
        onSurfaceVariant: '#BFC8CA',
        outline: '#899294',
        outlineVariant: '#3F484A',
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: '#E1E3E3',
        inverseOnSurface: '#2E3132',
        inversePrimary: '#006874',
        text: '#E1E3E3',
        // 新增 Material Design 3 的表面色调 - 深色模式
        surfaceDim: '#111415',
        surfaceBright: '#363A3A',
        surfaceContainerLowest: '#0C0F0F',
        surfaceContainerLow: '#191C1D',
        surfaceContainer: '#1D2021',
        surfaceContainerHigh: '#272B2B',
        surfaceContainerHighest: '#323536',
        // 状态层不变
        elevation: {
          level1: '0px 1px 3px rgba(0,0,0,0.5)',
          level2: '0px 2px 6px rgba(0,0,0,0.5)',
          level3: '0px 4px 12px rgba(0,0,0,0.5)',
          level4: '0px 6px 16px rgba(0,0,0,0.5)',
          level5: '0px 8px 20px rgba(0,0,0,0.5)'
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
        ...config.colors,
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