import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { UserAlignment } from '@shared/model/player';
import styled from 'styled-components';
import { useTranslation } from '@shared/i18n';

const AlignmentItemContainer = styled.td<{
  isSelected: boolean;
}>`
  width: 80px;
  height: 80px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.1s linear;
  background-color: ${(props) =>
    props.isSelected ? props.theme.color.transparent70 : 'transparent'};

  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? props.theme.color.transparent70
        : props.theme.color.transparent90};
  }
`;

interface AlignmentItemProps extends AlignmentChooseProps {
  name: UserAlignment;
  desc: string;
}
const AlignmentItem: React.FC<AlignmentItemProps> = TMemo((props) => {
  const { name, desc, value, onChange } = props;
  const isSelected = name === value;

  const handleClick = useCallback(() => {
    onChange(name);
  }, [name, onChange]);

  return (
    <AlignmentItemContainer isSelected={isSelected} onClick={handleClick}>
      {desc}
    </AlignmentItemContainer>
  );
});
AlignmentItem.displayName = 'AlignmentItem';

interface AlignmentChooseProps {
  value: string;
  onChange: (newValue: string) => void;
}
export const AlignmentChoose: React.FC<AlignmentChooseProps> = TMemo(
  (props) => {
    const { t } = useTranslation();

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <AlignmentItem {...props} name="LG" desc={t('LG')} />
              <AlignmentItem {...props} name="NG" desc={t('NG')} />
              <AlignmentItem {...props} name="CG" desc={t('CG')} />
            </tr>
            <tr>
              <AlignmentItem {...props} name="LN" desc={t('LN')} />
              <AlignmentItem {...props} name="TN" desc={t('TN')} />
              <AlignmentItem {...props} name="CN" desc={t('CN')} />
            </tr>
            <tr>
              <AlignmentItem {...props} name="LE" desc={t('LE')} />
              <AlignmentItem {...props} name="NE" desc={t('NE')} />
              <AlignmentItem {...props} name="CE" desc={t('CE')} />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);
AlignmentChoose.displayName = 'AlignmentChoose';
