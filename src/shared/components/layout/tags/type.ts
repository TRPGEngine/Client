import React from 'react';
import { LayoutProps } from '../processor';

export type TagComponent<T = {}> = React.FC<LayoutProps & T>;
