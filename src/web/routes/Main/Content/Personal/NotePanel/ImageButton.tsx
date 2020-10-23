import React, { useCallback } from 'react';
import { useSlate } from 'slate-react';
import { TMemo } from '@shared/components/TMemo';
import { FileSelector } from '@web/components/FileSelector';
import { toPersistenceImage } from '@shared/utils/upload-helper';
import { ToolbarButton } from '@web/components/editor/style';
import { insertImage } from '@web/components/editor/changes/insertImage';
import { showToasts } from '@shared/manager/ui';
import { Iconfont } from '@web/components/Iconfont';

/**
 * 上传图片按钮
 */

interface Props {
  attachUUID: string;
}
export const ImageButton: React.FC<Props> = TMemo((props) => {
  const { attachUUID } = props;
  const editor = useSlate();

  const handleSelected = useCallback(
    async (files: FileList) => {
      try {
        const file = files[0];
        const { url } = await toPersistenceImage(file, {
          usage: 'note',
          attachUUID,
        });

        insertImage(editor, url);
      } catch (e) {
        showToasts('图片插入失败: ' + String(e));
      }
    },
    [editor, attachUUID]
  );

  // TODO: 应当可以选择允许直接传入网址

  return (
    <FileSelector onSelected={handleSelected}>
      <ToolbarButton>
        <Iconfont>&#xe63b;</Iconfont>
      </ToolbarButton>
    </FileSelector>
  );
});
ImageButton.displayName = 'ImageButton';
