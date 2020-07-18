import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '../ModalPanel';
import ActorProfile from './ActorProfile';
import { TRPGState } from '@redux/types/__all__';
import _get from 'lodash/get';

/**
 * @deprecated
 * 从缓存中获取actor信息的中间组件
 */
interface Props {
  uuid: string;
  actorcache: any;
}
class ActorCacheProfile extends React.Component<Props> {
  render() {
    const uuid = this.props.uuid;
    const actorcache = this.props.actorcache;
    return (
      <ModalPanel title="人物信息">
        <ActorProfile actor={actorcache[uuid] ? _get(actorcache, uuid) : {}} />
      </ModalPanel>
    );
  }
}

export default connect((state: TRPGState) => ({
  actorcache: state.cache.actor,
}))(ActorCacheProfile);
