import React, { useEffect, useState, useCallback } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { getHelpFAQ, HelpFAQItem, sendFeedback } from '@portal/model/help';
import styled from 'styled-components';
import { ActionButton } from '@portal/components/ActionButton';
import { Divider, message } from 'antd';
import type { FormikHelpers } from 'formik';
import { FeedbackModal, FeedbackValues } from './modal/FeedbackModal';

const FAQList = styled.ul`
  > li {
    list-style-type: decimal-leading-zero;

    > p:nth-of-type(1):before {
      content: 'Q: ';
    }

    > p:nth-of-type(2):before {
      content: 'A: ';
    }
  }
`;

/**
 * @deprecated 请使用兔小巢 txc.tsx
 */
interface Props extends RouteComponentProps {}
const Help: React.FC<Props> = React.memo((props) => {
  const [faq, setFAQ] = useState<HelpFAQItem[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getHelpFAQ().then(setFAQ);
  }, []);

  const showFeedback = useCallback(() => {
    setVisible(true);
  }, []);
  const hideFeedback = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSubmit = useCallback(
    async (
      values: FeedbackValues,
      formikHelpers: FormikHelpers<FeedbackValues>
    ) => {
      formikHelpers.setSubmitting(true);
      try {
        await sendFeedback(values);

        formikHelpers.resetForm();
        hideFeedback();
      } catch (err) {
        message.error(String(err));
      } finally {
        formikHelpers.setSubmitting(false);
      }
    },
    []
  );

  return (
    <div>
      <FAQList>
        {faq.map((item, i) => (
          <li key={i}>
            <p>{item.q}</p>
            <p>{item.a}</p>
          </li>
        ))}
      </FAQList>

      <Divider>需要更多帮助? </Divider>
      <ActionButton type="primary" onClick={showFeedback}>
        提交反馈
      </ActionButton>
      <FeedbackModal
        visible={visible}
        onSubmit={handleSubmit}
        onCancel={hideFeedback}
      />
    </div>
  );
});
Help.displayName = 'Help';

export default Help;
