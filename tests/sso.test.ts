import { describe, it, expect } from 'vitest';
import {
  createSAMLConnection,
  createOAuthConnection,
  generateSAMLMetadata,
  generateOAuthAuthorizationUrl,
  validateSAMLConfig,
  validateOAuthConfig,
  getProviderDisplayName,
} from '@/lib/sso';

describe('SSO/SAML', () => {
  describe('createSAMLConnection', () => {
    it('should create SAML connection', () => {
      const config = {
        entityId: 'https://idp.example.com',
        ssoUrl: 'https://idp.example.com/sso',
        certificate: 'cert-data',
      };
      const result = createSAMLConnection('org-123', config);
      expect(result.provider).toBe('saml');
      expect(result.status).toBe('pending');
    });
  });

  describe('createOAuthConnection', () => {
    it('should create OAuth connection', () => {
      const config = {
        provider: 'google' as const,
        clientId: 'client-id',
        clientSecret: 'secret',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scopes: ['openid', 'email'],
      };
      const result = createOAuthConnection('org-123', config);
      expect(result.provider).toBe('oauth');
    });
  });

  describe('generateSAMLMetadata', () => {
    it('should generate valid XML metadata', () => {
      const config = {
        entityId: 'https://idp.example.com',
        ssoUrl: 'https://idp.example.com/sso',
        certificate: 'cert-data',
      };
      const result = generateSAMLMetadata(config);
      expect(result).toContain('<EntityDescriptor');
      expect(result).toContain('entityID="https://idp.example.com"');
    });
  });

  describe('generateOAuthAuthorizationUrl', () => {
    it('should generate authorization URL', () => {
      const config = {
        provider: 'google' as const,
        clientId: 'client-id',
        clientSecret: 'secret',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scopes: ['openid', 'email'],
      };
      const result = generateOAuthAuthorizationUrl(config, 'https://app.com/callback', 'state123');
      expect(result).toContain('client_id=client-id');
      expect(result).toContain('state=state123');
    });
  });

  describe('validateSAMLConfig', () => {
    it('should validate valid SAML config', () => {
      const config = {
        entityId: 'https://idp.example.com',
        ssoUrl: 'https://idp.example.com/sso',
        certificate: 'cert-data',
      };
      const result = validateSAMLConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should reject missing entity ID', () => {
      const config = { ssoUrl: 'https://idp.example.com/sso', certificate: 'cert' };
      const result = validateSAMLConfig(config);
      expect(result.valid).toBe(false);
    });

    it('should reject non-HTTPS SSO URL', () => {
      const config = { entityId: 'https://idp.example.com', ssoUrl: 'http://idp.example.com/sso', certificate: 'cert' };
      const result = validateSAMLConfig(config);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateOAuthConfig', () => {
    it('should validate valid OAuth config', () => {
      const config = {
        provider: 'google' as const,
        clientId: 'client-id',
        clientSecret: 'secret',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scopes: ['openid'],
      };
      const result = validateOAuthConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should reject missing client ID', () => {
      const config = {
        provider: 'google' as const,
        clientSecret: 'secret',
        authorizationUrl: 'https://auth.url',
        tokenUrl: 'https://token.url',
        userInfoUrl: 'https://userinfo.url',
        scopes: [],
      };
      const result = validateOAuthConfig(config);
      expect(result.valid).toBe(false);
    });
  });

  describe('getProviderDisplayName', () => {
    it('should return display names', () => {
      expect(getProviderDisplayName('saml')).toBe('SAML 2.0');
      expect(getProviderDisplayName('google')).toBe('Google');
      expect(getProviderDisplayName('okta')).toBe('Okta');
    });
  });
});
