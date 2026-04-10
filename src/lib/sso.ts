export type SSOProvider = 'saml' | 'oauth' | 'ldap';

export interface SAMLConfig {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface OAuthConfig {
  provider: 'google' | 'microsoft' | 'github' | 'okta';
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

export interface SSOConnection {
  id: string;
  orgId: string;
  provider: SSOProvider;
  status: 'active' | 'inactive' | 'pending';
  config: SAMLConfig | OAuthConfig;
  createdAt: string;
  updatedAt: string;
}

export function createSAMLConnection(orgId: string, config: SAMLConfig): SSOConnection {
  return {
    id: crypto.randomUUID(),
    orgId,
    provider: 'saml',
    status: 'pending',
    config,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createOAuthConnection(orgId: string, config: OAuthConfig): SSOConnection {
  return {
    id: crypto.randomUUID(),
    orgId,
    provider: 'oauth',
    status: 'pending',
    config,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateSAMLMetadata(config: SAMLConfig): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor entityID="${config.entityId}" xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
  <IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${config.ssoUrl}"/>
  </IDPSSODescriptor>
</EntityDescriptor>`;
}

export function generateOAuthAuthorizationUrl(config: OAuthConfig, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  });
  return `${config.authorizationUrl}?${params.toString()}`;
}

export async function exchangeOAuthCode(
  config: OAuthConfig,
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken?: string; expiresIn: number }> {
  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange OAuth code');
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

export async function getOAuthUserInfo(config: OAuthConfig, accessToken: string): Promise<Record<string, unknown>> {
  const response = await fetch(config.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

export function validateSAMLConfig(config: SAMLConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.entityId) errors.push('Entity ID is required');
  if (!config.ssoUrl) errors.push('SSO URL is required');
  if (!config.certificate) errors.push('Certificate is required');
  if (!config.ssoUrl.startsWith('https://')) errors.push('SSO URL must use HTTPS');

  return { valid: errors.length === 0, errors };
}

export function validateOAuthConfig(config: OAuthConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.clientId) errors.push('Client ID is required');
  if (!config.clientSecret) errors.push('Client Secret is required');
  if (!config.authorizationUrl) errors.push('Authorization URL is required');
  if (!config.tokenUrl) errors.push('Token URL is required');

  return { valid: errors.length === 0, errors };
}

export function getProviderDisplayName(provider: SSOProvider | OAuthConfig['provider']): string {
  const names: Record<string, string> = {
    saml: 'SAML 2.0',
    oauth: 'OAuth 2.0',
    ldap: 'LDAP/Active Directory',
    google: 'Google',
    microsoft: 'Microsoft',
    github: 'GitHub',
    okta: 'Okta',
  };
  return names[provider] || provider;
}
