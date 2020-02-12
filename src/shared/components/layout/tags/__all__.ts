import { register, registerTag } from '../tags';
import Col from './Col';
import Define from './Define';
import Input from './Input';
import Row from './Row';
import Select from './Select';
import Tabs from './Tabs';
import TextArea from './TextArea';
import Use from './Use';
import BaseInfo from './BaseInfo';
import Template from './Template';
import { TagColShared } from './Col/shared';
import { TagBaseAttrShared } from './BaseAttr/shared';
import { TagInputEdit } from './Input/edit';

register(Col);
register(Define);
register(Input);
register(Row);
register(Select);
register(Tabs);
register(TextArea);
register(Use);
register(BaseInfo);
register(Template);

registerTag('detail', 'Col', TagColShared);
registerTag('edit', 'Col', TagColShared);

registerTag('detail', 'BaseAttr', TagBaseAttrShared);
registerTag('edit', 'BaseAttr', TagBaseAttrShared);

registerTag('edit', 'Input', TagInputEdit);