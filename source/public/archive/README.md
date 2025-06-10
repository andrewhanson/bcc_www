# Sessionize Data Archival

This directory contains archived sessionize data for the Boise Code Camp 2025 event.

## Purpose

The archived data ensures that the website continues to function even if:
- Sessionize shuts down the API endpoint for the event
- Network connectivity to sessionize.com is unavailable
- The sessionize API key becomes invalid

## Structure

```
archive/
├── 2025/
│   ├── sessions.json    # Session data
│   ├── speakers.json    # Speaker data
│   └── schedule.json    # Schedule/grid data
└── README.md           # This file
```

## Data Format

Each JSON file contains:
- `archivedAt`: ISO timestamp of when the data was archived
- `archivedFor`: The year this data represents
- `data`: The actual sessionize API response data

## Usage

The SessionizeService automatically falls back to archived data when the live sessionize API is unavailable. The fallback logic:

1. First attempts to fetch from sessionize.com API
2. If that fails, loads from `/archive/2025/{type}.json`
3. If both fail, throws an error

## Archiving New Data

To archive the current sessionize data:

```bash
npm run archive
```

This will fetch the latest data from sessionize and save it to the archive directory.

## Preparing for Next Year

When preparing for 2026:

1. Run `npm run archive` to save the final 2025 data
2. Create new archive directory structure for 2026
3. Update AppState.js with 2026 configuration
4. Update the archive script for the new year