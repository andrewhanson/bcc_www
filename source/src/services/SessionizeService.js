import { AppState } from "../AppState.js";

const STORAGEKEY = AppState.STORAGE_KEY;
const APIKEY = AppState.SESSIONIZE_KEY;
const TYPES = {
  Sessions: 'sessions',
  Speakers: 'speakers', 
  GridSmart: 'schedule'
};

async function _getSessionizeData(type) {
  try {
    let res = await fetch(`https://sessionize.com/api/v2/${APIKEY}/view/${type}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    let data = await res.json();
    return data;
  } catch (error) {
    console.warn(`Failed to fetch ${type} from sessionize API, attempting to load from archive:`, error.message);
    return await _getArchivedData(TYPES[type]);
  }
}

async function _getArchivedData(filename) {
  try {
    const response = await fetch(`/archive/2025/${filename}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const archivedData = await response.json();
    console.log(`✓ Loaded archived ${filename} data from 2025`);
    return archivedData.data;
  } catch (error) {
    console.error(`Failed to load archived ${filename} data:`, error.message);
    throw new Error(`Unable to load ${filename} data from either sessionize API or archive`);
  }
}

function _cacheData(data) {
  data.cached = Date.now() + 1000 * 60 * 60 * 24;
  localStorage.setItem(STORAGEKEY, JSON.stringify(data));
}

async function _fetchData() {
  try {
    let [sessions, speakers, schedule] = await Promise.all(
      Object.keys(TYPES).map(async type => await _getSessionizeData(type))
    );
    let data = { sessions, speakers, schedule };
    _cacheData(data);
    return data;
  } catch (error) {
    console.error('Failed to fetch sessionize data:', error.message);
    throw error;
  }
}

export default class SessionizeService {
  static async loadData() {
    let data = JSON.parse(localStorage.getItem(STORAGEKEY));
    if (!data || data.cached < Date.now()) {
      data = await _fetchData();
    }

    AppState.sessions = data.sessions;
    AppState.speakers = data.speakers;
    AppState.schedule = data.schedule;
  }
}
