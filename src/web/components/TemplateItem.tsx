import React from 'react';
import moment from 'moment';

import './TemplateItem.scss';
import { Tooltip } from 'antd';
import { TMemo } from '@shared/components/TMemo';

interface Props {
  canEdit: boolean;
  name: string;
  desc: string;
  creator: string;
  time: string;
  onCreate?: () => void;
}

const TemplateItem: React.FC<Props> = TMemo((props) => {
  const { name, desc, creator, time } = props;
  return (
    <div className="template-item" onClick={props.onCreate}>
      <div className="header">
        <Tooltip title={name}>
          <div className="name">{name}</div>
        </Tooltip>
      </div>
      <Tooltip title={desc} trigger="click">
        <div className="desc">{desc}</div>
      </Tooltip>
      <div className="footer">
        <div className="creator" title={creator}>
          {creator}
        </div>
        <div className="time">{moment(time).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    </div>
  );
});
TemplateItem.displayName = 'TemplateItem';

export default TemplateItem;
