import React, { useCallback, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { DndProvider, useDrop, useDrag, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const SortableListItemTypeSymbol = Symbol('SortableListItemTypeSymbol');

type RenderItemFunc = (item: any) => React.ReactNode;

interface DragItem {
  index: number;
  uuid: string;
  type: symbol;
}

interface SortableListItemProps {
  index: number;
  item: any;
  renderItem: RenderItemFunc;
  onMoveItem: (dragIndex: number, hoverIndex: number) => void;
}
const SortableListItem: React.FC<SortableListItemProps> = TMemo((props) => {
  const { item, index, onMoveItem, renderItem } = props;
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: SortableListItemTypeSymbol,
    hover(hoverItem: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = hoverItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMoveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      hoverItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: SortableListItemTypeSymbol, uuid: item.uuid, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }}>
      {renderItem(item)}
    </div>
  );
});
SortableListItem.displayName = 'SortableListItem';

interface SortableListProps<T = any> {
  list: T[];
  itemKey: string;
  onChange: (list: T[]) => void;
  renderItem: RenderItemFunc;
}
export const SortableList: React.FC<SortableListProps> = TMemo((props) => {
  const { list, onChange, itemKey, renderItem } = props;

  const handleMoveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newItems = [...list];

      const [item] = newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, item);

      onChange(newItems);
    },
    [list, onChange]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {list.map((item, i) => (
          <SortableListItem
            key={item[itemKey]}
            index={i}
            item={item}
            renderItem={renderItem}
            onMoveItem={handleMoveItem}
          />
        ))}
      </div>
    </DndProvider>
  );
});
SortableList.displayName = 'SortableList';
