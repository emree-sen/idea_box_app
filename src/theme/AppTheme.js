import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Modern Professional Color Palette
const colors = {
  primary: '#6366F1',      // Modern Indigo
  primaryLight: '#8B5CF6',  // Purple accent
  primaryDark: '#4F46E5',   // Darker indigo
  secondary: '#10B981',     // Emerald green
  accent: '#F59E0B',        // Amber
  background: '#FAFAFA',    // Light gray
  surface: '#FFFFFF',       // Pure white
  surfaceVariant: '#F3F4F6', // Light variant
  error: '#EF4444',         // Red
  warning: '#F59E0B',       // Amber
  success: '#10B981',       // Green
  info: '#3B82F6',          // Blue
  onSurface: '#1F2937',     // Dark gray for text
  onBackground: '#374151',   // Medium gray for secondary text
  outline: '#E5E7EB',       // Border color
  shadow: '#00000020',      // Shadow with opacity
  gradient: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#10B981', '#059669'],
    accent: ['#F59E0B', '#D97706'],
  }
};

const darkColors = {
  primary: '#818CF8',       // Lighter indigo for dark mode
  primaryLight: '#A78BFA',  // Lighter purple
  primaryDark: '#6366F1',   // Standard indigo
  secondary: '#34D399',     // Lighter emerald
  accent: '#FBBF24',        // Lighter amber
  background: '#111827',    // Dark background
  surface: '#1F2937',       // Dark surface
  surfaceVariant: '#374151', // Dark variant
  error: '#F87171',         // Lighter red
  warning: '#FBBF24',       // Lighter amber
  success: '#34D399',       // Lighter green
  info: '#60A5FA',          // Lighter blue
  onSurface: '#F9FAFB',     // Light text on dark
  onBackground: '#E5E7EB',   // Light gray for secondary text
  outline: '#4B5563',       // Dark border
  shadow: '#00000040',      // Stronger shadow for dark mode
  gradient: {
    primary: ['#818CF8', '#A78BFA'],
    secondary: ['#34D399', '#10B981'],
    accent: ['#FBBF24', '#F59E0B'],
  }
};

// Typography
const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  headlineLarge: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 26,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  titleLarge: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  titleMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Shadows
const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Border Radius
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  typography,
  spacing,
  shadows,
  borderRadius,
};

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  typography,
  spacing,
  shadows,
  borderRadius,
};

// Custom hook for theme colors
export const useAppColors = (isDark = false) => {
  return isDark ? darkColors : colors;
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    marginBottom: spacing.md,
  },
  button: {
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  input: {
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    borderColor: colors.outline,
  },
  text: {
    color: colors.onSurface,
  },
  textSecondary: {
    color: colors.onBackground,
  },
  gradient: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
};