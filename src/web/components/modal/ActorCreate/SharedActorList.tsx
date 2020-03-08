import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import ModalPanel from '@web/components/ModalPanel';
import { ActorType } from '@redux/types/actor';
import { fetchAllSharedActor } from '@shared/model/actor';
import { ActorCard } from '@web/components/ActorCard';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { forkActor } from '@redux/actions/actor';
import { showModal } from '@redux/actions/ui';
import ActorInfo from '../ActorInfo';

interface Props {}
export const SharedActorList: React.FC<Props> = TMemo(() => {
  const [sharedActors, setSharedActors] = useState<ActorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useTRPGDispatch();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const sharedActors = await fetchAllSharedActor();
      setIsLoading(false);
      setSharedActors(sharedActors);
    })();
  }, [setIsLoading, setSharedActors]);

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

  return (
    <ModalPanel title="人物库" style={{ width: 620, height: 540 }}>
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
                <button onClick={() => handleShowActorInfo(actor)}>查看</button>
              </Fragment>
            }
          />
        ))}
      </div>
    </ModalPanel>
  );
});
SharedActorList.displayName = 'SharedActorList';
