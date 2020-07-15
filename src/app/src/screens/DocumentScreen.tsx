import React from 'react';
import { Text } from 'react-native';
import { List } from '@ant-design/react-native';
import {
  fetchDocumentList,
  DocumentListType,
  fetchDocumentLink,
} from '@src/shared/model/file';
import { StackScreenProps } from '@react-navigation/stack';
import { TRPGStackParamList } from '@app/types/params';
import { openWebview } from '@app/navigate';
const Item = List.Item;

interface State {
  docs: DocumentListType[];
}
interface Props extends StackScreenProps<TRPGStackParamList, 'Document'> {}

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

  handlePress = async (uuid: string) => {
    const link = await fetchDocumentLink(uuid);
    openWebview(this.props.navigation, link);
  };

  render() {
    const { docs } = this.state;

    return (
      <List>
        {docs.length > 0 ? (
          docs.map((doc, i) => (
            <Item
              key={i}
              arrow="horizontal"
              onPress={() => this.handlePress(doc.uuid)}
            >
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
