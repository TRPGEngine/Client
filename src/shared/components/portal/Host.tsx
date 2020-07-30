import React, { useCallback, useRef, Fragment } from 'react';
import { DeviceEventEmitter, NativeEventEmitter, View } from 'react-native';
import { useEffect } from 'react';
import { TMemo } from '../TMemo';
import PortalManager from './Manager';

type Operation =
  | { type: 'mount'; key: number; children: React.ReactNode }
  | { type: 'update'; key: number; children: React.ReactNode }
  | { type: 'unmount'; key: number };

type PortalMethods = {
  mount: (children: React.ReactNode) => number;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
};
const PortalContext = React.createContext<PortalMethods | null>(null);

// events
const addType = 'ADD_PORTAL';
const removeType = 'REMOVE_PORTAL';

const TopViewEventEmitter = DeviceEventEmitter || new NativeEventEmitter();
class PortalGuard {
  private nextKey = 10000;
  add = (el: React.ReactNode, hostName = 'default') => {
    const key = this.nextKey++;
    TopViewEventEmitter.emit(addType, el, key, hostName);
    return key;
  };
  remove = (key: number, hostName = 'default') =>
    TopViewEventEmitter.emit(removeType, key, hostName);
}
const guard = new PortalGuard();

export const PortalHost: React.FC<{
  name: string;
}> & {
  add?: typeof guard.add;
  remove?: typeof guard.remove;
} = TMemo((props) => {
  const managerRef = useRef<PortalManager>();
  const nextKeyRef = useRef<number>(0);
  const queueRef = useRef<Operation[]>([]);
  const hostNameRef = useRef(props.name);
  useEffect(() => {
    hostNameRef.current = props.name;
  }, [props.name]);

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
    TopViewEventEmitter.addListener(addType, mount);
    TopViewEventEmitter.addListener(addType, unmount);

    return () => {
      TopViewEventEmitter.removeListener(addType, mount);
      TopViewEventEmitter.removeListener(removeType, unmount);
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
      <PortalManager ref={managerRef as any} />
    </PortalContext.Provider>
  );
});
PortalHost.defaultProps = {
  name: 'default',
};
PortalHost.displayName = 'PortalHost';
PortalHost.add = guard.add;
PortalHost.remove = guard.remove;
