import delay from './delay';
import {
  getRecord,
  setRecord,
} from './indexedDB';

export async function getCanvas(id) {
  await delay();
  return await getRecord(id) || {};
}

export async function saveCanvas(data) {
  await delay();
  return await setRecord(data) || {};
}
