import React from 'react';
import { Text } from 'react-native';
import { List } from '@ant-design/react-native';
import { fetchDocumentList, DocumentListType } from '@src/shared/model/file';
const Item = List.Item;

interface State {
  docs: DocumentListType[];
}
interface Props {}

class DocumentScreen extends React.Component<Props, State> {
  state: Readonly<State> = {
    docs: [],
  };

  async componentDidMount() {
    const list = await fetchDocumentList();
    this.setState({
      docs: list,
    });
  }

  handlePress = (uuid: string) => {
    alert(uuid);
  };

  render() {
    const { docs } = this.state;

    return (
      <List>
        {docs.length > 0 ? (
          docs.map((doc) => (
            <Item arrow="horizontal" onPress={() => this.handlePress(doc.uuid)}>
              {doc.name}
            </Item>
          ))
        ) : (
          <Text>加载中...</Text>
        )}
      </List>
    );
  }
}

export default DocumentScreen;
