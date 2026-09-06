import { describe, it, expect } from 'vitest';
import {
  defaultSEO,
  seoKeywords,
  generatePersonJSONLD,
  generateWebSiteJSONLD,
  generateProfilePageJSONLD,
  generateBreadcrumbJSONLD,
  generateStructuredDataGraph,
} from '@/lib/seo';

describe('SEO & Structured Data Test Suite', () => {
  describe('defaultSEO configuration', () => {
    it('contains brand keywords in default title and description', () => {
      expect(defaultSEO.title).toContain('Krishna Naik');
      expect(defaultSEO.title).toContain('Krishna');
      expect(defaultSEO.description).toContain('Krishna Naik');
      expect(defaultSEO.description).toContain('Krishna');
      expect(defaultSEO.url).toBe('https://krishna-naik.vercel.app');
      expect(defaultSEO.siteName).toContain('Krishna Naik');
    });
  });

  describe('seoKeywords array', () => {
    it('contains all essential target variations for Krishna and Krishna Naik', () => {
      const requiredKeywords = [
        'Krishna',
        'krishna',
        'KRISHNA',
        'Krishna Naik',
        'krishna naik',
        'KRISHNA NAIK',
        'Krishna Umesh Naik',
        'krishna umesh naik',
        'KRISHNA UMESH NAIK',
        'KrishnaNaik',
        'krishnanaik',
        'KrishnaNaik6',
        'krishnanaik6',
        'Krishna Naik portfolio',
        'krishna naik portfolio',
        'Krishna portfolio',
        'krishna portfolio',
        'Krishna Naik developer',
        'Krishna developer',
        'Krishna Naik software developer',
        'Krishna Naik full stack developer',
        'Krishna Naik AI engineer',
        'Krishna AI engineer',
        'Krishna Naik Next.js developer',
        'Krishna Naik React developer',
        'Krishna Naik Python developer',
        'Krishna Naik GitHub',
        'Krishna Naik Bengaluru',
      ];

      requiredKeywords.forEach((kw) => {
        expect(seoKeywords).toContain(kw);
      });

      expect(seoKeywords.length).toBeGreaterThan(40);
    });

    it('contains comprehensive casing variations (lowercase, uppercase, title case, slug) for search keys', () => {
      const casingVariations = [
        // 'krishna' variations
        'krishna',
        'Krishna',
        'KRISHNA',
        // 'krishna naik' variations
        'krishna naik',
        'Krishna Naik',
        'KRISHNA NAIK',
        // 'krishna umesh naik' variations
        'krishna umesh naik',
        'Krishna Umesh Naik',
        'KRISHNA UMESH NAIK',
        // username and slug variations
        'krishnanaik',
        'KrishnaNaik',
        'KRISHNANAIK',
        'krishnanaik6',
        'KrishnaNaik6',
        'KRISHNANAIK6',
        'krishna_naik',
        'krishna-naik',
        // query variations
        'krishna portfolio',
        'Krishna portfolio',
        'KRISHNA PORTFOLIO',
        'krishna naik portfolio',
        'Krishna Naik portfolio',
        'KRISHNA NAIK PORTFOLIO',
        'krishna developer',
        'Krishna developer',
        'KRISHNA DEVELOPER',
        'krishna naik developer',
        'Krishna Naik developer',
        'KRISHNA NAIK DEVELOPER',
      ];

      casingVariations.forEach((kw) => {
        expect(seoKeywords).toContain(kw);
      });
    });
  });

  describe('generatePersonJSONLD()', () => {
    it('generates a Schema.org Person with complete alternate names and profile details', () => {
      const person = generatePersonJSONLD();

      expect(person['@context']).toBe('https://schema.org');
      expect(person['@type']).toBe('Person');
      expect(person['@id']).toBe('https://krishna-naik.vercel.app/#person');
      expect(person.name).toBe('Krishna Naik');
      expect(person.givenName).toBe('Krishna');
      expect(person.familyName).toBe('Naik');
      expect(person.additionalName).toBe('Umesh');

      // Verify alternate name variations are populated
      expect(person.alternateName).toContain('Krishna');
      expect(person.alternateName).toContain('krishna');
      expect(person.alternateName).toContain('KRISHNA');
      expect(person.alternateName).toContain('Krishna Naik');
      expect(person.alternateName).toContain('krishna naik');
      expect(person.alternateName).toContain('KRISHNA NAIK');
      expect(person.alternateName).toContain('Krishna Umesh Naik');
      expect(person.alternateName).toContain('krishna umesh naik');
      expect(person.alternateName).toContain('KrishnaNaik6');
      expect(person.alternateName).toContain('Krishna Portfolio');

      // Verify occupation, address and sameAs
      expect(person.address.addressLocality).toBe('Bengaluru');
      expect(person.address.addressCountry).toBe('India');
      expect(person.sameAs).toContain('https://github.com/KrishnaNaik6');
      expect(person.sameAs).toContain('https://www.linkedin.com/in/krishnaunaik/');
      expect(person.sameAs).toContain('https://krishna-naik.vercel.app');
    });
  });

  describe('generateWebSiteJSONLD()', () => {
    it('generates a Schema.org WebSite linked to the person entity', () => {
      const website = generateWebSiteJSONLD();

      expect(website['@context']).toBe('https://schema.org');
      expect(website['@type']).toBe('WebSite');
      expect(website['@id']).toBe('https://krishna-naik.vercel.app/#website');
      expect(website.name).toBe('Krishna Naik Portfolio');
      expect(website.alternateName).toContain('Krishna Portfolio');
      expect(website.publisher['@id']).toBe('https://krishna-naik.vercel.app/#person');
      expect(website.author['@id']).toBe('https://krishna-naik.vercel.app/#person');
      expect(website.keywords).toContain('Krishna Naik');
      expect(website.keywords).toContain('Krishna');
    });
  });

  describe('generateProfilePageJSONLD()', () => {
    it('generates a Schema.org ProfilePage referencing person and website', () => {
      const profilePage = generateProfilePageJSONLD();

      expect(profilePage['@context']).toBe('https://schema.org');
      expect(profilePage['@type']).toBe('ProfilePage');
      expect(profilePage['@id']).toBe('https://krishna-naik.vercel.app/#profilepage');
      expect(profilePage.isPartOf['@id']).toBe('https://krishna-naik.vercel.app/#website');
      expect(profilePage.mainEntity['@id']).toBe('https://krishna-naik.vercel.app/#person');
      expect(profilePage.name).toContain('Krishna Naik');
      expect(profilePage.name).toContain('Krishna');
    });
  });

  describe('generateBreadcrumbJSONLD()', () => {
    it('generates a Schema.org BreadcrumbList with home and portfolio items', () => {
      const breadcrumb = generateBreadcrumbJSONLD();

      expect(breadcrumb['@context']).toBe('https://schema.org');
      expect(breadcrumb['@type']).toBe('BreadcrumbList');
      expect(breadcrumb['@id']).toBe('https://krishna-naik.vercel.app/#breadcrumb');
      expect(breadcrumb.itemListElement).toHaveLength(2);
      expect(breadcrumb.itemListElement[1].name).toBe('Krishna Naik Portfolio');
    });
  });

  describe('generateStructuredDataGraph()', () => {
    it('bundles Person, WebSite, ProfilePage, and BreadcrumbList into a unified @graph', () => {
      const graphWrapper = generateStructuredDataGraph();

      expect(graphWrapper['@context']).toBe('https://schema.org');
      expect(Array.isArray(graphWrapper['@graph'])).toBe(true);
      expect(graphWrapper['@graph']).toHaveLength(4);

      const types = graphWrapper['@graph'].map((node: any) => node['@type']);
      expect(types).toContain('Person');
      expect(types).toContain('WebSite');
      expect(types).toContain('ProfilePage');
      expect(types).toContain('BreadcrumbList');
    });
  });

  describe('Favicon & Search Engine Icon Assets', () => {
    it('ensures all required icon assets exist for Google Search, browsers, and mobile devices', async () => {
      const fs = await import('fs');
      const path = await import('path');

      const expectedFiles = [
        'public/favicon.ico',
        'public/k.svg',
        'public/icon.svg',
        'public/favicon-48x48.png', // Google's official size requirement
        'public/favicon-32x32.png',
        'public/favicon-16x16.png',
        'public/apple-touch-icon.png',
        'public/android-chrome-192x192.png',
        'public/android-chrome-512x512.png',
      ];

      for (const file of expectedFiles) {
        const fullPath = path.resolve(process.cwd(), file);
        expect(fs.existsSync(fullPath), `Missing icon file: ${file}`).toBe(true);
        const stats = fs.statSync(fullPath);
        expect(stats.size).toBeGreaterThan(0);
      }

      // Check ICO magic header [0x00, 0x00, 0x01, 0x00]
      const icoBuf = fs.readFileSync(path.resolve(process.cwd(), 'public/favicon.ico'));
      expect(icoBuf[0]).toBe(0);
      expect(icoBuf[1]).toBe(0);
      expect(icoBuf[2]).toBe(1);
      expect(icoBuf[3]).toBe(0);
    });
  });
});
