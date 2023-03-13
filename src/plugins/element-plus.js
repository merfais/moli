import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/color-picker/style/css';
import 'element-plus/es/components/table-v2/style/css';
import 'element-plus/es/components/table/style/css';
import 'element-plus/es/components/table-column/style/css';
import {
  ElConfigProvider,
  ElDatePicker,
  ElColorPicker,
  ElTableV2,
  ElAutoResizer,
} from 'element-plus';

export function add(app) {
  app.use(ElConfigProvider);
  app.use(ElDatePicker);
  app.use(ElColorPicker);
  app.use(ElTableV2);
  app.use(ElAutoResizer);
}

