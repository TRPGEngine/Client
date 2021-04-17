import React, { useState, useMemo, useRef } from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _isFunction from 'lodash/isFunction';
import _cloneDeep from 'lodash/cloneDeep';
import {
  XMLBuilder,
  XMLBuilderRef,
} from '@shared/components/layout/XMLBuilder';
import { Row, Button } from 'antd';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { useCachedActorTemplateInfo } from '@redux/hooks/useCache';
import { showToasts } from '@shared/manager/ui';
import { updateGroupActorInfo } from '@redux/actions/group';
import { editGroupActor } from '@shared/model/group';
import { t, useTranslation } from '@shared/i18n';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { AddonMore } from '../AddonMore';
import { fileToText, openFile } from '@web/utils/file-helper';

/**
 * 人物卡编辑模态框
 */

const Container = styled(Row)`
  min-width: 600px;
`;

interface ActorEditModalProps {
  name?: string;
  desc?: string;
  avatar?: string;
  data?: {};
  templateUUID: string;
  onSave?: (data: any) => void;
}
const ActorEdit: React.FC<ActorEditModalProps> = TMemo((props) => {
  const [actorData, setActorData] = useState(_cloneDeep(props.data));
  const xmlRef = useRef<XMLBuilderRef>(null);

  let title = '人物卡';
  if (!_isNil(props.name)) {
    title += ' - ' + props.name;
  }

  const actions = useMemo(
    () => (
      <Button
        onClick={() => _isFunction(props.onSave) && props.onSave(actorData)}
      >
        保存
      </Button>
    ),
    [props.onSave, actorData]
  );

  const template = useCachedActorTemplateInfo(props.templateUUID);
  const layout = _get(template, 'layout');

  const addonItems = [
    {
      label: t('导入人物卡'),
      onClick: async () => {
        if (_isNil(xmlRef.current)) {
          return;
        }

        if (typeof xmlRef.current.updateAllData === 'function') {
          // 导入人物卡
          const file = await openFile({
            accept: 'application/json',
          });

          if (_isNil(file)) {
            return;
          }

          try {
            const text = await fileToText(file);
            const data = JSON.parse(text);
            xmlRef.current.updateAllData(data);
            showToasts(t('人物卡加载成功'));
          } catch (err) {
            console.error(err);
            showToasts(`${t('人物卡解析错误')}: ${err}`, 'error');
          }
        }
      },
    },
  ];

  return _isString(layout) ? (
    <ModalPanel
      title={title}
      headerActions={<AddonMore placement="bottomRight" items={addonItems} />}
      actions={actions}
      allowMaximize={true}
    >
      <Container>
        <XMLBuilder
          ref={xmlRef}
          xml={layout}
          initialData={actorData}
          layoutType="edit"
          onChange={(newState) => setActorData(newState.data)}
        />
      </Container>
    </ModalPanel>
  ) : null;
});
ActorEdit.defaultProps = {
  data: {},
};
ActorEdit.displayName = 'ActorEdit';

export default ActorEdit;

/**
 * 团人物卡编辑
 */
interface GroupActorModalEditProps extends ActorEditModalProps {
  groupUUID: string;
  groupActorUUID: string;
}
export const GroupActorEditModal: React.FC<GroupActorModalEditProps> = TMemo(
  (props) => {
    const {
      name,
      avatar,
      desc,
      data,
      templateUUID,
      onSave,
      groupUUID,
      groupActorUUID,
    } = props;
    const { t } = useTranslation();
    const dispatch = useTRPGDispatch();

    const handleSave = (data) => {
      editGroupActor(groupUUID, groupActorUUID, data)
        .then(() => {
          dispatch(updateGroupActorInfo(groupUUID, groupActorUUID, data));
          showToasts(t('保存完毕!'), 'success');
          _isFunction(onSave) && onSave(data);
        })
        .catch((err) => {
          showToasts(String(err), 'error');
          console.error(err);
        });
    };

    return (
      <ActorEdit
        name={name}
        avatar={avatar}
        desc={desc}
        data={data}
        templateUUID={templateUUID}
        onSave={handleSave}
      />
    );
  }
);
GroupActorEditModal.displayName = 'GroupActorEditModal';
