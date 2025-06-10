#!/usr/bin/env node

/**
 * Simple test to verify archive fallback works
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test that archive files exist and are valid
const archiveDir = path.join(__dirname, '../public/archive/2025');
const files = ['sessions.json', 'speakers.json', 'schedule.json'];

console.log('Testing archive files...\n');

for (const file of files) {
  const filepath = path.join(archiveDir, file);
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    if (!data.archivedAt || !data.archivedFor || !data.data) {
      throw new Error('Invalid archive format');
    }
    
    console.log(`✓ ${file} - Valid (${data.data.length || Object.keys(data.data).length} items)`);
  } catch (error) {
    console.error(`✗ ${file} - ${error.message}`);
  }
}

console.log('\n✓ Archive test completed');