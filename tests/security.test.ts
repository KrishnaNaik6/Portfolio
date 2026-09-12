import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security & Non-Exposure Verification', () => {
  it('keeps NEXIS credentials server-side and out of example public prefixes', () => {
    const envExamplePath = path.resolve(__dirname, '../.env.example');
    const envContent = fs.readFileSync(envExamplePath, 'utf-8');

    expect(envContent).toContain('NEXIS_API_KEY=');
    expect(envContent).not.toContain('NEXT_PUBLIC_NEXIS_API_KEY');
  });

  it('ensures client-side component files never import or read NEXIS_API_KEY', () => {
    const componentsDir = path.resolve(__dirname, '../components');
    const readDirRecursive = (dir: string): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      let files: string[] = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) files = files.concat(readDirRecursive(fullPath));
        else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) files.push(fullPath);
      }
      return files;
    };

    for (const file of readDirRecursive(componentsDir)) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('process.env.NEXIS_API_KEY');
      expect(content).not.toContain('NEXT_PUBLIC_NEXIS_API_KEY');
    }
  });

  it('ensures source contains no hard-coded NEXIS credential fallback', () => {
    const nexisPath = path.resolve(__dirname, '../lib/nexis.ts');
    const content = fs.readFileSync(nexisPath, 'utf-8');
    expect(content).not.toMatch(/NEXIS_API_KEY\s*\|\|\s*['\"]/);
    expect(content).not.toContain('nx_app_');
  });

  it('ensures API route handlers do not expose NEXIS credentials in responses or headers', () => {
    const routePath = path.resolve(__dirname, '../app/api/portfolio/route.ts');
    const content = fs.readFileSync(routePath, 'utf-8');
    expect(content).not.toContain('Authorization');
    expect(content).not.toContain('NEXIS_API_KEY');
  });
});
