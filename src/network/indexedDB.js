import { errorLog } from '@/uses/log';

const VERSION = 1;
const DB_NAME = 'moli';
const TABLE_NAME = 'canvas';
const KEY_PATH = 'id';

const dbMap = {};

async function open(options = {}) {
  const {
    dbName = DB_NAME,
    version = VERSION,
    tableName = TABLE_NAME,
    keyPath = KEY_PATH,
  } = options;
  return new Promise((resolve, reject) => {
    const dbKey = `${dbName}_${version}`;
    if (dbMap[dbKey]) {
      return resolve(dbMap[dbKey]);
    }

    function onerror(e) {
      errorLog({ e, msg: '打开indexed db 出现错误' });
      dbName[dbKey] = undefined;
      reject(e);
    }

    const req = window.indexedDB.open(dbName, version);
    req.onerror = onerror;
    req.onsuccess = (e) => {
      const db = e.target.result;
      dbMap[dbKey] = db;
      resolve(db);
    };
    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      db.onerror = onerror;
      db.createObjectStore(tableName, { keyPath });
    };
  });
}

export async function getRecord(id, options = {}) {
  const {
    tableName = TABLE_NAME,
  } = options;
  const db = await open(options);

  return new Promise((resolve, reject) => {
    const tsn = db.transaction([tableName], 'readonly');
    tsn.onerror = (e) => {
      errorLog({ e, msg: '打开 transaction 失败' });
      reject(e);
    };
    const store = tsn.objectStore(tableName);
    const req = store.get(id);
    req.onsuccess = (e) => {
      resolve(e.target.result);
    };
    req.onerror = e => {
      errorLog({ e, msg: `读取${id}数据失败` });
      reject(e);
    };
  });
}

export async function setRecord(data, options = {}) {
  const {
    tableName = TABLE_NAME,
  } = options;
  const db = await open(options);

  return new Promise((resolve, reject) => {
    const tsn = db.transaction([tableName], 'readwrite');
    tsn.onerror = (e) => {
      errorLog({ e, msg: '打开 transaction 失败' });
      reject(e);
    };
    const store = tsn.objectStore(tableName);
    const req = store.put(data);
    req.onsuccess = () => {
      resolve(data);
    };
    req.onerror = e => {
      errorLog({ e, msg: '写入数据失败' });
      reject(e);
    };
  });
}
