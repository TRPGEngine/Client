import React from 'react';
import { ScrollView, Text } from 'react-native';
import {
  getLogger,
  ActionsListItem,
} from '@src/shared/redux/configureStore/memory-logger';
import { Accordion, WingBlank } from '@ant-design/react-native';
const AccordionPanel = Accordion.Panel;

interface State {
  sections: number[];
  logger: ActionsListItem[];
}
class DebugScreen extends React.Component<{}, State> {
  state: State = {
    sections: [],
    logger: [],
  };

  componentDidMount() {
    this.setState({ logger: getLogger().reverse() });
  }

  renderItem = (item: ActionsListItem, index: number) => {
    return (
      <AccordionPanel key={index + item[0]} header={item[0]}>
        <WingBlank>
          <Text>{JSON.stringify(item[1], null, 4)}</Text>
        </WingBlank>
      </AccordionPanel>
    );
  };

  render() {
    const { logger, sections } = this.state;

    return (
      <ScrollView>
        <Text>总计: {logger.length}</Text>
        <Accordion
          expandMultiple
          activeSections={sections}
          onChange={(sections) => this.setState({ sections })}
        >
          {logger.map(this.renderItem)}
        </Accordion>
      </ScrollView>
    );
  }
}

export default DebugScreen;
