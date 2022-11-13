// import {
//   get
// } from 'lodash-es'
import getThemeConfig from '@/canvas-themes';
import {
  COMP_KEY,
  COMP_GROUP_KEY,
} from './constants';
import input from './input/config';
import select from './select/config';

const compConfigMap = {
  input,
  select,
};

/**
 * 加载异步的资源
 * TODO: 第三方贡献的插件
 */
async function loadConfig() {
  return {};
}

/**
 * 获取组件的配置信息
 */
export async function getCompConfig(compKey, options = {}) {
  try {
    const themeConfig = getThemeConfig(options.themeName);
    const params = { ...options, themeConfig };
    if (compConfigMap[compKey]) {
      return compConfigMap[compKey](params);
    }
    return loadConfig(compKey, params);
  } catch (e) {
    console.error(`获取组件[${compKey}]配置出错:`, e);
    return {};
  }
}

// /**
//  * 获取组件layout的配置
//  */
// async function getLayoutConfig(...args) {
//   const config = await getCompConfig(...args);
//   return get(config, 'layout') || {}
// }
//
// /**
//  * 获取组件props的配置
//  */
// async function getPropsConfig(...args) {
//   const config = await getCompConfig(...args);
//   return get(config, 'props') || {};
// }
//
// /**
//  * 获取组件的关键的配置
//  */
// async function getExtraConfig(...args) {
//   const config = await getCompConfig(...args);
//   return {
//     name: get(config, 'name', ''),
//     component: get(config, 'component', ''),
//   };
// }


/**
 * 是否为容器组件
 * @param {String} compKey 组件的key
 * @returns {Boolean}
 */
export function isContainerComp(compKey) {
  return compKey === COMP_KEY.TABS
    || compKey === COMP_KEY.PANEL
    || compKey === COMP_KEY.CAROUSEL;
}

export async function getCompGroupConfig() {
  return [{
    groupKey: COMP_GROUP_KEY.INTERACT,
    groupName: '交互组件',
    comps: [
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
    ],
  }, {
    groupKey: COMP_GROUP_KEY.CHART,
    groupName: '图表组件',
    comps: [
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
    ],
  }, {
    groupKey: COMP_GROUP_KEY.RICH,
    groupName: '富组件',
    comps: [
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
    ],
  }, {
    groupKey: COMP_GROUP_KEY.PANEL,
    groupName: '容器组件',
    comps: [
      COMP_KEY.INPUT,
      COMP_KEY.SELECT,
    ],
  }];
}

