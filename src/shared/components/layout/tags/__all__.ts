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
import { TagTipShared } from './Tip/shared';
import { TagRadarShared } from './Radar/shared';
import { TagFunctionShared } from './Function/shared';
import { TagInputNumberEdit } from './InputNumber/edit';
import { TagStyledShared } from './Styled/shared';

// 展示数据组件
registerTag('Template', TagTemplateShared);

registerTag('Row', TagRowShared);

registerTag('Col', TagColShared);

registerTag('BaseInfo', TagBaseInfoDetail, TagBaseInfoEdit);

registerTag('Tabs', TagTabsShared);

registerTag('Bar', TagBarShared);

registerTag('Hidden', TagHiddenShared);

registerTag('FieldSet', TagFieldSetShared);

registerTag('Tip', TagTipShared);

registerTag('Radar', TagRadarShared);

registerTag('Styled', TagStyledShared);

// 数据录入组件
registerTag('BaseAttr', TagBaseAttrShared);

registerTag('Input', TagInputDetail, TagInputEdit);

registerTag('InputNumber', TagInputDetail, TagInputNumberEdit);

registerTag('TextArea', TagInputDetail, TagTextAreaEdit);

registerTag('Select', TagInputDetail, TagSelectEdit);

registerTag('RollBtn', TagRollBtnDetail, TagRollBtnEdit);

// 高级操作组件
registerTag('Use', TagUseShared);

registerTag('Define', TagDefineShared);

registerTag('Var', TagVarShared);

registerTag('Computed', TagComputedShared);

registerTag('Function', TagFunctionShared);
