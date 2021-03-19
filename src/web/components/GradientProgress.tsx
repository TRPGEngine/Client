import { TMemo } from '@shared/components/TMemo';
import { useValueRef } from '@shared/hooks/useValueRef';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import styled from 'styled-components';
import _isNil from 'lodash/isNil';

const notchWidth = 8;

const Wrapper = styled.div`
  height: 20px;
  width: 100%;
`;

const Container = styled.div`
  width: 560px;
  background: none;
  position: relative;
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const Progress = styled.div`
  background-color: #72767d;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const backgroundColor = '434343'; // #434343
const Notches = styled.div`
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='20' fill='%23${backgroundColor}'%3E%3Cpath fill-rule='evenodd' d='M0 0h8v20H0V0zm4 2a2 2 0 00-2 2v12a2 2 0 104 0V4a2 2 0 00-2-2z'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

interface GradientProgressProps {
  gradientEnd?: string;
  gradientStart?: string;

  /**
   * 百进制进度条 0~100
   */
  progress: number;
}
export const GradientProgress: React.FC<GradientProgressProps> = TMemo(
  (props) => {
    const {
      progress,
      gradientStart = '#fbb848',
      gradientEnd = '#43b581',
    } = props;
    const [barWidth, setBarWidth] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const roundToNearestStep = useCallback((round: number) => {
      return Math.round(round / notchWidth) * notchWidth;
    }, []);

    const roundToNearestStepRef = useValueRef(roundToNearestStep);

    useEffect(() => {
      function computeBars() {
        const el = wrapperRef.current;
        setBarWidth(
          _isNil(el) ? 0 : roundToNearestStepRef.current(el.clientWidth)
        );
      }

      computeBars();
      window.addEventListener('resize', computeBars);

      return () => window.removeEventListener('resize', computeBars);
    }, []);

    const gradientStyle = useMemo(() => {
      return {
        width: barWidth,
        background:
          progress <= 0
            ? 'none'
            : 'linear-gradient(to right, ' +
              gradientStart +
              ', ' +
              gradientEnd +
              ')',
      };
    }, [barWidth, progress, gradientStart, gradientEnd]);

    const progressStyle = useMemo(() => {
      const t = 100 - Math.max(0, Math.min(100, progress));
      const progressWidth = (barWidth * t) / 100;
      const step = roundToNearestStepRef.current(progressWidth);

      return {
        transform: 'translateX(' + Math.abs(step - barWidth) + 'px)',
      };
    }, [progress, barWidth]);

    return (
      <Wrapper ref={wrapperRef}>
        <Container style={gradientStyle}>
          <Progress style={progressStyle} />
          <Notches />
        </Container>
      </Wrapper>
    );
  }
);
GradientProgress.displayName = 'GradientProgress';
