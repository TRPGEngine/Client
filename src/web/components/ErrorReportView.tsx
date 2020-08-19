import React, { useMemo, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  getFeedbackUrl,
  showReportDialog,
  getLastEventId,
} from '@web/utils/sentry';
import _isNil from 'lodash/isNil';
import { Button, Row, Col } from 'antd';
import { WebFastForm } from './WebFastForm';
import { FastFormFieldMeta } from '@shared/components/FastForm';
import { t } from '@shared/i18n';
import { sendUserFeedback } from '@shared/model/sentry';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import { showToasts } from '@shared/manager/ui';

const fields: FastFormFieldMeta[] = [
  {
    type: 'text',
    name: 'email',
    label: '联系邮箱',
  },
  {
    type: 'textarea',
    name: 'comments',
    label: '问题描述',
  },
];

export const ErrorReportView: React.FC = TMemo(() => {
  const userInfo = useCurrentUserInfo();
  const userName = getUserName(userInfo);
  const handleSendUserFeedback = useCallback(
    async (values) => {
      try {
        await sendUserFeedback({
          name: `${userName}(${userInfo.uuid})`,
          email: values.email,
          comments: values.comments,
        });
        showToasts('发送成功', 'success');
      } catch (err) {
        showToasts('发送失败, 请检查输入');
      }
    },
    [userInfo.uuid, userName]
  );

  const reportView = useMemo(() => {
    const lastEventId = getLastEventId();
    if (_isNil(lastEventId)) {
      return <div>暂时没有发生错误...</div>;
    }

    const feedbackUrl = getFeedbackUrl();
    if (_isNil(feedbackUrl)) {
      return (
        <Button
          onClick={() => {
            showReportDialog();
          }}
        >
          {t('汇报错误')}
        </Button>
      );
    } else {
      return <WebFastForm fields={fields} onSubmit={handleSendUserFeedback} />;
    }
  }, [handleSendUserFeedback]);

  return (
    <div>
      <h3 style={{ marginBottom: 24 }}>
        发生了一些问题? 如果您愿意帮忙，请帮助我们改善!
      </h3>

      <Row>
        <Col sm={18}>{reportView}</Col>
      </Row>
    </div>
  );
});
ErrorReportView.displayName = 'ErrorReportView';
