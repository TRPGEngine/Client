import React from 'react';
import { Picker } from 'react-native';
const PickerItem = Picker.Item;

interface Props {
  items: Array<{ label: string; value: any }>;
  defaultValue?: any;
  selectedValue?: any;
  onValueChange?: (itemValue: any, itemIndex: number) => void;
}
class TPicker extends React.Component<Props> {
  static getDerivedStateFromProps(nextProps: Props) {
    if ('selectedValue' in nextProps) {
      return {
        selectedValue: nextProps.selectedValue,
      };
    }

    return null;
  }

  state = {
    selectedValue: this.props.defaultValue,
  };

  handleValueChange = (itemValue: any, itemPosition: number) => {
    const { onValueChange } = this.props;

    this.setState({ selectedValue: itemValue });
    onValueChange && onValueChange(itemValue, itemPosition);
  };

  render() {
    const { items } = this.props;
    const { selectedValue } = this.state;

    return (
      <Picker
        selectedValue={selectedValue}
        onValueChange={this.handleValueChange}
      >
        {items.map((item) => (
          <PickerItem label={item.label} value={item.value} />
        ))}
      </Picker>
    );
  }
}

export default TPicker;
