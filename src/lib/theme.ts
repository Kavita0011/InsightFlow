import type { Org } from '@/types';

export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: number;
  logoUrl?: string;
}

export const defaultTheme: Theme = {
  primaryColor: '#3B82F6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  fontFamily: 'Inter, sans-serif',
  borderRadius: 8,
};

export function generateEmbedCode(dashboardId: string, orgSlug: string): string {
  return `https://insightflow.app/embed/${orgSlug}/${dashboardId}`;
}

export function generateIframeCode(dashboardId: string, orgSlug: string, theme?: Partial<Theme>): string {
  const embedUrl = generateEmbedCode(dashboardId, orgSlug);
  const themeParams = theme ? `?theme=${encodeURIComponent(JSON.stringify(theme))}` : '';
  return `<iframe src="${embedUrl}${themeParams}" width="100%" height="600" frameborder="0"></iframe>`;
}

export function applyTheme(org: Org, overrides?: Partial<Theme>): Theme {
  return {
    ...defaultTheme,
    primaryColor: org.primary_color || defaultTheme.primaryColor,
    ...overrides,
  };
}

export function generateThemeCSS(theme: Theme): string {
  return `
    :root {
      --primary-color: ${theme.primaryColor};
      --background-color: ${theme.backgroundColor};
      --text-color: ${theme.textColor};
      --font-family: ${theme.fontFamily};
      --border-radius: ${theme.borderRadius}px;
    }
  `;
}

export function validateThemeColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function parseThemeFromString(themeString: string): Partial<Theme> | null {
  try {
    return JSON.parse(themeString);
  } catch {
    return null;
  }
}
