import { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Button, Text } from '@tarojs/components';
import { AtCard } from 'taro-ui';
import { fetchAllRecruitList } from '@shared/model/trpg';

import { add, minus, asyncAdd } from '../../actions/counter';

import './index.less';

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number;
  };
};

type PageDispatchProps = {
  add: () => void;
  dec: () => void;
  asyncAdd: () => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

// @connect(
//   ({ counter }) => ({
//     counter,
//   }),
//   (dispatch) => ({
//     add() {
//       dispatch(add());
//     },
//     dec() {
//       dispatch(minus());
//     },
//     asyncAdd() {
//       dispatch(asyncAdd());
//     },
//   })
// )
// class Index extends Component {
//   componentWillReceiveProps(nextProps) {
//     console.log(this.props, nextProps);
//   }

//   componentWillUnmount() {}

//   componentDidShow() {}

//   componentDidHide() {}

//   render() {
//     return (
//       <View className="index">
//         <Button className="add_btn" onClick={this.props.add}>
//           +
//         </Button>
//         <Button className="dec_btn" onClick={this.props.dec}>
//           -
//         </Button>
//         <Button className="dec_btn" onClick={this.props.asyncAdd}>
//           async
//         </Button>
//         <View>
//           <Text>{this.props.counter.num}</Text>
//         </View>
//         <View>
//           <Text>Hello, World</Text>
//         </View>
//       </View>
//     );
//   }
// }

const Index: React.FC = () => {
  useEffect(() => {
    fetchAllRecruitList().then((reportList) => {
      console.log(reportList);
    });
  }, []);

  return (
    <View>
      <AtCard
        note="小Tips"
        extra="额外信息"
        title="这是个标题"
        thumb="http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG"
      >
        这也是内容区 可以随意定义功能
      </AtCard>
    </View>
  );
};

export default Index;
