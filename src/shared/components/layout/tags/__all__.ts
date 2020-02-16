import { registerTag } from '../tags';
import { TagColShared } from './Col/shared';
import { TagBaseAttrShared } from './BaseAttr/shared';
import { TagInputEdit } from './Input/edit';
import { TagUseShared } from './Use/shared';
import { TagDefineShared } from './Define/shared';
import { TagTextAreaEdit } from './TextArea/edit';
import { TagInputDetail } from './Input/detail';
import { TagSelectEdit } from './Select/edit';
import { TagTemplateShared } from './Template/shared';
import { TagBaseInfoEdit } from './BaseInfo/edit';
import { TagBaseInfoDetail } from './BaseInfo/detail';
import { TagRowShared } from './Row/shared';
import { TagTabsShared } from './Tabs/shared';
import { TagBarShared } from './Bar/shared';
import { TagHiddenShared } from './Hidden/shared';
import { TagVarShared } from './Var/shared';
import { TagFieldSetShared } from './FieldSet/shared';
import { TagRollBtnEdit } from './RollBtn/edit';
import { TagRollBtnDetail } from './RollBtn/detail';
import { TagComputedShared } from './Computed/shared';

// 展示数据组件
registerTag('detail', 'Template', TagTemplateShared);
registerTag('edit', 'Template', TagTemplateShared);

registerTag('detail', 'Row', TagRowShared);
registerTag('edit', 'Row', TagRowShared);

registerTag('detail', 'Col', TagColShared);
registerTag('edit', 'Col', TagColShared);

registerTag('detail', 'BaseInfo', TagBaseInfoDetail);
registerTag('edit', 'BaseInfo', TagBaseInfoEdit);

registerTag('edit', 'Tabs', TagTabsShared);
registerTag('detail', 'Tabs', TagTabsShared);

registerTag('edit', 'Bar', TagBarShared);
registerTag('detail', 'Bar', TagBarShared);

registerTag('edit', 'Hidden', TagHiddenShared);
registerTag('detail', 'Hidden', TagHiddenShared);

registerTag('edit', 'FieldSet', TagFieldSetShared);
registerTag('detail', 'FieldSet', TagFieldSetShared);

// 数据录入组件
registerTag('detail', 'BaseAttr', TagBaseAttrShared);
registerTag('edit', 'BaseAttr', TagBaseAttrShared);

registerTag('edit', 'Input', TagInputEdit);
registerTag('detail', 'Input', TagInputDetail);

registerTag('edit', 'TextArea', TagTextAreaEdit);
registerTag('detail', 'TextArea', TagInputDetail);

registerTag('edit', 'Select', TagSelectEdit);
registerTag('detail', 'Select', TagInputDetail);

registerTag('edit', 'RollBtn', TagRollBtnEdit);
registerTag('detail', 'RollBtn', TagRollBtnDetail);

// 高级操作组件
registerTag('detail', 'Use', TagUseShared);
registerTag('edit', 'Use', TagUseShared);

registerTag('detail', 'Define', TagDefineShared);
registerTag('edit', 'Define', TagDefineShared);

registerTag('detail', 'Var', TagVarShared);
registerTag('edit', 'Var', TagVarShared);

registerTag('detail', 'Computed', TagComputedShared);
registerTag('edit', 'Computed', TagComputedShared);
