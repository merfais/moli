import {
  getRecord,
  setRecord,
} from './indexedDB';

export async function getCanvas(id) {
  return await getRecord(id) || {};
}

export async function saveCanvas(data) {
  return await setRecord(data) || {};
}
