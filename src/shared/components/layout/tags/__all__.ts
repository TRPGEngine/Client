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
import { TagScriptShared } from './Script/shared';
import { TagForEachShared } from './ForEach/shared';
import { TagStaticShared } from './Static/shared';
import { TagDataTableShared } from './DataTable/shared';
import { TagDividerShared } from './Divider/shared';
import { TagCheckboxDetail } from './Checkbox/detail';
import { TagCheckboxEdit } from './Checkbox/edit';
import { TagCustomListShared } from './CustomList/shared';
import { TagCustomListEdit } from './CustomList/edit';
import { TagCurrMaxEdit } from './CurrMax/edit';
import { TagCurrMaxDetail } from './CurrMax/detail';
import { TagSpaceShared } from './Space/shared';

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

registerTag('DataTable', TagDataTableShared);

registerTag('Radar', TagRadarShared);

registerTag('Styled', TagStyledShared);

registerTag('Divider', TagDividerShared);

registerTag('Space', TagSpaceShared);

// 数据录入组件
registerTag('BaseAttr', TagBaseAttrShared);

registerTag('Input', TagInputDetail, TagInputEdit);

registerTag('InputNumber', TagInputDetail, TagInputNumberEdit);

registerTag('TextArea', TagInputDetail, TagTextAreaEdit);

registerTag('Select', TagInputDetail, TagSelectEdit);

registerTag('Checkbox', TagCheckboxDetail, TagCheckboxEdit);

registerTag('RollBtn', TagRollBtnDetail, TagRollBtnEdit);

registerTag('CurrMax', TagCurrMaxDetail, TagCurrMaxEdit);

// 高级操作组件
registerTag('Use', TagUseShared);

registerTag('Define', TagDefineShared);

registerTag('Var', TagVarShared);

registerTag('Static', TagStaticShared);

registerTag('Computed', TagComputedShared);

registerTag('Function', TagFunctionShared);

registerTag('Script', TagScriptShared);

registerTag('ForEach', TagForEachShared);

registerTag('CustomList', TagCustomListShared, TagCustomListEdit);
