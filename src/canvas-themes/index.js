import white from './white';
import dark from './dark';
import blue from './blue';

export const themeNameMap = {
  white: '白色',
  dark: '暗色',
  blue: '蓝色',
};

export default function getThemeConfig(themeName = 'white') {
  const themeConfigMap = {
    white,
    dark,
    blue,
  };
  return themeConfigMap[themeName] || themeConfigMap.white;
}
