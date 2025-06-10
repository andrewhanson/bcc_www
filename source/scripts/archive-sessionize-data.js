#!/usr/bin/env node

/**
 * Script to archive current sessionize data to static JSON files
 * This preserves the 2025 data permanently for future reference
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration from AppState
const APIKEY = 'ud5iskr9';
const TYPES = {
  Sessions: 'sessions',
  Speakers: 'speakers', 
  GridSmart: 'schedule'
};

const ARCHIVE_DIR = path.join(__dirname, '../public/archive/2025');

async function fetchSessionizeData(type) {
  console.log(`Fetching ${type} data...`);
  try {
    const response = await axios.get(`https://sessionize.com/api/v2/${APIKEY}/view/${type}`);
    const data = response.data;
    console.log(`✓ Successfully fetched ${type} data`);
    return data;
  } catch (error) {
    console.error(`✗ Failed to fetch ${type} data:`, error.message);
    throw error;
  }
}

async function saveToFile(data, filename) {
  const filepath = path.join(ARCHIVE_DIR, filename);
  try {
    // Add metadata about when this was archived
    const archivedData = {
      archivedAt: new Date().toISOString(),
      archivedFor: '2025',
      data: data
    };
    
    await fs.promises.writeFile(filepath, JSON.stringify(archivedData, null, 2), 'utf8');
    console.log(`✓ Saved ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to save ${filename}:`, error.message);
    throw error;
  }
}

async function archiveSessionizeData() {
  try {
    console.log('Starting sessionize data archival process...');
    console.log(`Archive directory: ${ARCHIVE_DIR}`);
    
    // Ensure archive directory exists
    await fs.promises.mkdir(ARCHIVE_DIR, { recursive: true });
    
    // Fetch and save each type of data
    for (const [apiType, filename] of Object.entries(TYPES)) {
      const data = await fetchSessionizeData(apiType);
      await saveToFile(data, `${filename}.json`);
    }
    
    console.log('\n✓ Successfully archived all sessionize data for 2025!');
    console.log('Files created:');
    console.log(`  - ${path.join(ARCHIVE_DIR, 'sessions.json')}`);
    console.log(`  - ${path.join(ARCHIVE_DIR, 'speakers.json')}`);
    console.log(`  - ${path.join(ARCHIVE_DIR, 'schedule.json')}`);
    
  } catch (error) {
    console.error('\n✗ Archival process failed:', error.message);
    process.exit(1);
  }
}

// Run the archival process
archiveSessionizeData();