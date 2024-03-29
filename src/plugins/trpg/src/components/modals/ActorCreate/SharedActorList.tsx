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
import { fetchSharedActor } from '../../../model/actor';
import { ActorCard } from '../../ActorCard';
import { useTRPGDispatch } from '@capital/shared/redux/hooks/useTRPGSelector';
import { forkActor } from '../../../redux/actions/actor';
import ActorInfo from '../ActorInfo';
import { Empty, Pagination } from 'antd';
import LoadingSpinner from '@capital/web/components/LoadingSpinner';
import { t } from '@capital/shared/i18n';
import { closeModal, openModal } from '@capital/web/components/Modal';

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
      dispatch(
        forkActor(uuid, () => {
          closeModal();
        })
      );
    },
    [dispatch]
  );

  const handleShowActorInfo = useCallback(
    (actor: ActorType) => {
      openModal(
        <ActorInfo templateUUID={actor.template_uuid} data={actor.info} />
      );
    },
    [dispatch]
  );

  return useMemo(
    () => (
      <ModalPanel title={t('人物库')} style={{ width: 620, height: 540 }}>
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
