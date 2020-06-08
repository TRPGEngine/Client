import React from 'react';
import { Text } from 'react-native';
import { List } from '@ant-design/react-native';
import {
  fetchDocumentList,
  DocumentListType,
  fetchDocumentLink,
} from '@src/shared/model/file';
import { openWebview } from '../redux/actions/nav';
import { RootStackParamList } from '@app/router';
import { StackScreenProps } from '@react-navigation/stack';
const Item = List.Item;

interface State {
  docs: DocumentListType[];
}
interface Props extends StackScreenProps<RootStackParamList, 'Document'> {}

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
    // TODO 需要处理
    const link = await fetchDocumentLink(uuid);
    this.props.navigation.dispatch(openWebview(link));
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
