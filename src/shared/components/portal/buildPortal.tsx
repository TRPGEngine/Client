import React, { useCallback, useRef, Fragment, useContext } from 'react';
// import { DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import { useEffect } from 'react';
import { TMemo } from '../TMemo';
import { PortalManager } from './Manager';
import { createPortalContext } from './context';
import { PortalConsumer } from './Consumer';
import _isNil from 'lodash/isNil';

type Operation =
  | { type: 'mount'; key: number; children: React.ReactNode }
  | { type: 'update'; key: number; children: React.ReactNode }
  | { type: 'unmount'; key: number };

// Events const
const addType = 'ADD_PORTAL';
const removeType = 'REMOVE_PORTAL';

// For react-native
// const TopViewEventEmitter = DeviceEventEmitter || new NativeEventEmitter();

interface EventEmitterFunc {
  emit: (...args: any[]) => any;
  addListener: (...args: any[]) => any;
  removeListener: (...args: any[]) => any;
}
export interface BuildPortalOptions {
  hostName: string;
  eventEmitter: EventEmitterFunc;
  renderManagerView: (children: React.ReactNode) => React.ReactElement;
}
export function buildPortal(options: BuildPortalOptions) {
  const { hostName, eventEmitter, renderManagerView } = options;
  let nextKey = 10000;

  const add = (el: React.ReactNode): number => {
    const key = nextKey++;
    eventEmitter.emit(addType, el, key, hostName);
    return key;
  };

  const remove = (key: number): void => {
    eventEmitter.emit(removeType, key, hostName);
  };

  const PortalContext = createPortalContext(hostName);

  const PortalHost = TMemo((props) => {
    const managerRef = useRef<PortalManager>();
    const nextKeyRef = useRef<number>(0);
    const queueRef = useRef<Operation[]>([]);
    const hostNameRef = useRef(hostName);
    useEffect(() => {
      hostNameRef.current = hostName;
    }, [hostName]);

    const mount: any = useCallback(
      (children: React.ReactNode, _key?: number, name?: string) => {
        if (name !== hostNameRef.current) {
          return;
        }

        const key = _key || nextKeyRef.current++;
        if (managerRef.current) {
          managerRef.current.mount(key, children);
        } else {
          queueRef.current.push({ type: 'mount', key, children });
        }

        return key;
      },
      []
    );

    const update = useCallback(
      (key: number, children: React.ReactNode, name?: string) => {
        if (name !== hostNameRef.current) {
          return;
        }

        if (managerRef.current) {
          managerRef.current.update(key, children);
        } else {
          const op: Operation = { type: 'mount', key, children };
          const index = queueRef.current.findIndex(
            (o) => o.type === 'mount' || (o.type === 'update' && o.key === key)
          );

          if (index > -1) {
            queueRef.current[index] = op;
          } else {
            queueRef.current.push(op);
          }
        }
      },
      []
    );

    const unmount = useCallback((key: number, name?: string) => {
      if (name !== hostNameRef.current) {
        return;
      }

      if (managerRef.current) {
        managerRef.current.unmount(key);
      } else {
        queueRef.current.push({ type: 'unmount', key });
      }
    }, []);

    useEffect(() => {
      eventEmitter.addListener(addType, mount);
      eventEmitter.addListener(removeType, unmount);

      return () => {
        eventEmitter.removeListener(addType, mount);
        eventEmitter.removeListener(removeType, unmount);
      };
    }, [mount, unmount]);

    return (
      <PortalContext.Provider
        value={{
          mount,
          update,
          unmount,
        }}
      >
        <Fragment>{props.children}</Fragment>
        <PortalManager
          ref={managerRef as any}
          renderManagerView={renderManagerView}
        />
      </PortalContext.Provider>
    );
  });
  PortalHost.displayName = 'PortalHost-' + hostName;

  const PortalRender = TMemo((props) => {
    const manager = useContext(PortalContext);

    if (_isNil(manager)) {
      console.error('Not find PortalContext');
      return null;
    }

    return <PortalConsumer manager={manager}>{props.children}</PortalConsumer>;
  });
  PortalRender.displayName = 'PortalRender-' + hostName;

  return { add, remove, PortalHost, PortalRender };
}
