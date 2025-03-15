import { computed, watch } from 'vue';
import { useTheme } from './useTheme';

// 使用现有的主题系统
export function useMDUITheme() {
  const { currentTheme, currentThemeConfig, isDark } = useTheme();

  // 将现有主题配置映射到MDUI的CSS变量
  const updateMDUIThemeVariables = (config) => {
    // 设置MDUI的CSS变量 - Material 3 颜色系统
    document.documentElement.style.setProperty('--mdui-color-primary', config.colors.primary);
    document.documentElement.style.setProperty('--mdui-color-on-primary', config.colors.onPrimary);
    document.documentElement.style.setProperty('--mdui-color-primary-container', config.colors.primaryContainer || '#EADDFF');
    document.documentElement.style.setProperty('--mdui-color-on-primary-container', config.colors.onPrimaryContainer || '#21005E');
    
    document.documentElement.style.setProperty('--mdui-color-secondary', config.colors.secondary);
    document.documentElement.style.setProperty('--mdui-color-on-secondary', config.colors.onSecondary);
    document.documentElement.style.setProperty('--mdui-color-secondary-container', config.colors.secondaryContainer || '#E8DEF8');
    document.documentElement.style.setProperty('--mdui-color-on-secondary-container', config.colors.onSecondaryContainer || '#1E192B');
    
    document.documentElement.style.setProperty('--mdui-color-tertiary', config.colors.tertiary);
    document.documentElement.style.setProperty('--mdui-color-on-tertiary', config.colors.onTertiary);
    document.documentElement.style.setProperty('--mdui-color-tertiary-container', config.colors.tertiaryContainer || '#FFD8E4');
    document.documentElement.style.setProperty('--mdui-color-on-tertiary-container', config.colors.onTertiaryContainer || '#370B1E');
    
    document.documentElement.style.setProperty('--mdui-color-error', config.colors.error || '#B3261E');
    document.documentElement.style.setProperty('--mdui-color-on-error', config.colors.onError || '#FFFFFF');
    document.documentElement.style.setProperty('--mdui-color-error-container', config.colors.errorContainer || '#F9DEDC');
    document.documentElement.style.setProperty('--mdui-color-on-error-container', config.colors.onErrorContainer || '#410E0B');
    
    document.documentElement.style.setProperty('--mdui-color-surface', config.colors.surface);
    document.documentElement.style.setProperty('--mdui-color-on-surface', config.colors.onSurface);
    document.documentElement.style.setProperty('--mdui-color-surface-variant', config.colors.surfaceVariant);
    document.documentElement.style.setProperty('--mdui-color-on-surface-variant', config.colors.onSurfaceVariant || '#49454F');
    
    document.documentElement.style.setProperty('--mdui-color-background', config.colors.background);
    document.documentElement.style.setProperty('--mdui-color-on-background', config.colors.onBackground || config.colors.text);
    
    document.documentElement.style.setProperty('--mdui-color-outline', config.colors.outline);
    document.documentElement.style.setProperty('--mdui-color-outline-variant', config.colors.outlineVariant || config.colors.outline);
    
    document.documentElement.style.setProperty('--mdui-color-inverse-surface', config.colors.inverseSurface || '#E6E1E5');
    document.documentElement.style.setProperty('--mdui-color-inverse-on-surface', config.colors.inverseOnSurface || '#313033');
    document.documentElement.style.setProperty('--mdui-color-inverse-primary', config.colors.inversePrimary || '#6750A4');
    
    // 新增 Material Design 3 的表面色调变体
    document.documentElement.style.setProperty('--mdui-color-surface-dim', config.colors.surfaceDim || '#DED8E1');
    document.documentElement.style.setProperty('--mdui-color-surface-bright', config.colors.surfaceBright || '#FFFBFF');
    document.documentElement.style.setProperty('--mdui-color-surface-container-lowest', config.colors.surfaceContainerLowest || '#FFFFFF');
    document.documentElement.style.setProperty('--mdui-color-surface-container-low', config.colors.surfaceContainerLow || '#F7F2FA');
    document.documentElement.style.setProperty('--mdui-color-surface-container', config.colors.surfaceContainer || '#F3EDF7');
    document.documentElement.style.setProperty('--mdui-color-surface-container-high', config.colors.surfaceContainerHigh || '#ECE6F0');
    document.documentElement.style.setProperty('--mdui-color-surface-container-highest', config.colors.surfaceContainerHighest || '#E6E0E9');
    
    // 设置状态层不透明度
    if (config.colors.stateLayerOpacity) {
      document.documentElement.style.setProperty('--mdui-state-hover-opacity', config.colors.stateLayerOpacity.hover || '0.08');
      document.documentElement.style.setProperty('--mdui-state-focus-opacity', config.colors.stateLayerOpacity.focus || '0.12');
      document.documentElement.style.setProperty('--mdui-state-pressed-opacity', config.colors.stateLayerOpacity.pressed || '0.12');
      document.documentElement.style.setProperty('--mdui-state-dragged-opacity', config.colors.stateLayerOpacity.dragged || '0.16');
    }
    
    // 设置圆角 - Material 3 形状系统
    document.documentElement.style.setProperty('--mdui-shape-corner-extra-small', '4px');
    document.documentElement.style.setProperty('--mdui-shape-corner-small', '8px');
    document.documentElement.style.setProperty('--mdui-shape-corner-medium', '12px');
    document.documentElement.style.setProperty('--mdui-shape-corner-large', config.borderRadius || '16px');
    document.documentElement.style.setProperty('--mdui-shape-corner-extra-large', '28px');
    
    // 设置阴影 - Material 3 高度系统
    if (config.colors.elevation) {
      document.documentElement.style.setProperty('--mdui-elevation-level1', config.colors.elevation.level1);
      document.documentElement.style.setProperty('--mdui-elevation-level2', config.colors.elevation.level2);
      document.documentElement.style.setProperty('--mdui-elevation-level3', config.colors.elevation.level3);
      document.documentElement.style.setProperty('--mdui-elevation-level4', config.colors.elevation.level4 || config.colors.elevation.level3);
      document.documentElement.style.setProperty('--mdui-elevation-level5', config.colors.elevation.level5 || config.colors.elevation.level3);
    }
    
    // 设置全局CSS变量，用于Tailwind和其他组件
    document.documentElement.style.setProperty('--color-primary', config.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', config.colors.secondary);
    document.documentElement.style.setProperty('--color-tertiary', config.colors.tertiary);
    document.documentElement.style.setProperty('--color-background', config.colors.background);
    document.documentElement.style.setProperty('--color-surface', config.colors.surface);
    document.documentElement.style.setProperty('--color-text', config.colors.text);
    
    // 新增表面色调变体的全局变量
    document.documentElement.style.setProperty('--color-surface-dim', config.colors.surfaceDim);
    document.documentElement.style.setProperty('--color-surface-bright', config.colors.surfaceBright);
    document.documentElement.style.setProperty('--color-surface-container-lowest', config.colors.surfaceContainerLowest);
    document.documentElement.style.setProperty('--color-surface-container-low', config.colors.surfaceContainerLow);
    document.documentElement.style.setProperty('--color-surface-container', config.colors.surfaceContainer);
    document.documentElement.style.setProperty('--color-surface-container-high', config.colors.surfaceContainerHigh);
    document.documentElement.style.setProperty('--color-surface-container-highest', config.colors.surfaceContainerHighest);
  };
  
  // 监听主题变化并更新MDUI变量
  watch(
    () => currentThemeConfig.value,
    (newConfig) => {
      if (newConfig) {
        updateMDUIThemeVariables(newConfig);
      }
    },
    { immediate: true, deep: true }
  );
  
  // 初始化时应用一次主题
  if (currentThemeConfig.value) {
    updateMDUIThemeVariables(currentThemeConfig.value);
  }
  
  return {
    currentThemeConfig,
    isDark
  };
}