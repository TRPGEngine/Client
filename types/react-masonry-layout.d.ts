/**
 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/45254
 */
/// <reference types="react" />

declare namespace ReactMasonryLayoutExport {
  interface MasonryLayoutSizes {
    mq: string;
    columns: number;
    gutter: number;
  }

  interface MasonryLayoutProps {
    id: string;
    packed?: string;
    sizes?: MasonryLayoutSizes[];
    position?: boolean;
    className?: string;
    style?: React.CSSProperties;
    infiniteScroll?: () => void;
    infiniteScrollContainer?: string;
    infiniteScrollDisabled?: boolean;
    infiniteScrollLoading?: boolean;
    infiniteScrollEnd?: boolean;
    infiniteScrollDistance?: number;
    infiniteScrollSpinner?: React.ReactNode;
    infiniteScrollEndIndicator?: React.ReactNode;
  }
}

declare const ReactMasonryLayoutExport: React.ComponentType<ReactMasonryLayoutExport.MasonryLayoutProps>;

declare module 'react-masonry-layout' {
  export = ReactMasonryLayoutExport;
}
