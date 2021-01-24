import type React from 'react';
import type { LayoutProps } from '../processor';

export type TagComponent<T = {}> = React.FC<LayoutProps & T>;
