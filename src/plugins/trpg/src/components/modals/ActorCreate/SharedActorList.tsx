import React, {
  useEffect,
  useState,
  useCallback,
  Fragment,
  useMemo,
} from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import ModalPanel from '@capital/web/components/ModalPanel';
import type { ActorType } from '../../../redux/types/actor';
import { fetchSharedActor } from '@capital/shared/model/actor';
import { ActorCard } from '../../ActorCard';
import { useTRPGDispatch } from '@capital/shared/redux/hooks/useTRPGSelector';
import { forkActor } from '../../../redux/actions/actor';
import { hideModal, showModal } from '@capital/shared/redux/actions/ui';
import ActorInfo from '../ActorInfo';
import { Button, Empty, Pagination } from 'antd';
import LoadingSpinner from '@capital/web/components/LoadingSpinner';
import { t } from '@capital/shared/i18n';
import ActorCreate from '.';

interface Props {}
export const SharedActorList: React.FC<Props> = TMemo(() => {
  const [sharedActors, setSharedActors] = useState<ActorType[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useTRPGDispatch();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { count, list } = await fetchSharedActor('', page);
      setIsLoading(false);
      setCount(count);
      setSharedActors(list);
    })();
  }, [setIsLoading, setCount, setSharedActors, page]);

  const handleFork = useCallback(
    (uuid: string) => {
      dispatch(forkActor(uuid));
    },
    [dispatch]
  );

  const handleShowActorInfo = useCallback(
    (actor: ActorType) => {
      dispatch(
        showModal(
          <ActorInfo templateUUID={actor.template_uuid} data={actor.info} />
        )
      );
    },
    [dispatch]
  );

  const actions = (
    <Button
      style={{ width: '30%' }}
      onClick={() => {
        dispatch(hideModal());
        dispatch(showModal(<ActorCreate />));
      }}
    >
      {t('返回')}
    </Button>
  );

  return useMemo(
    () => (
      <ModalPanel
        title={t('人物库')}
        style={{ width: 620, height: 540 }}
        actions={actions}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : Array.isArray(sharedActors) && sharedActors.length > 0 ? (
          <div
            style={{
              padding: '0 10px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {sharedActors.map((actor) => (
              <ActorCard
                key={actor.uuid}
                actor={actor}
                actions={
                  <Fragment>
                    <button onClick={() => handleFork(actor.uuid)}>Fork</button>
                    <button onClick={() => handleShowActorInfo(actor)}>
                      {t('查看')}
                    </button>
                  </Fragment>
                }
              />
            ))}
          </div>
        ) : (
          <Empty />
        )}

        <Pagination
          size="small"
          current={page}
          hideOnSinglePage={true}
          showSizeChanger={false}
          onChange={(page) => setPage(page)}
          disabled={isLoading}
          total={count}
        />
      </ModalPanel>
    ),
    [sharedActors, handleFork, handleShowActorInfo, page, isLoading, count]
  );
});
SharedActorList.displayName = 'SharedActorList';
