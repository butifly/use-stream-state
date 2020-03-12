import { useEffect, useState, useCallback } from 'react';
import useConstant from 'use-constant';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

export type RestrictArray<T> = T extends any[] ? T : [];

export type EventCallback<EventValue, State, Inputs> = Inputs extends void ?
  (eventSource$: Observable<EventValue>, state$: BehaviorSubject<State>) => Observable<State> :
  (
    eventSource$: Subject<EventValue>,
    state$: BehaviorSubject<State>,
    inputs$: BehaviorSubject<Inputs>,
  ) => Observable<State> | Subject<State>;

export function useStreamState<State, EventValue = State, Inputs = void>(
  initialState: State,
  callback: EventCallback<EventValue, State, Inputs>,
  inputs?: RestrictArray<Inputs>,
): [State, (e: EventValue) => void, (s: State) => void] {

  const [state, setState] = useState<State>(initialState);
  const event$ = useConstant(() => new Subject<EventValue>());
  const state$ = useConstant(() => new BehaviorSubject<State>(state));

  const inputs$ = useConstant(() => new BehaviorSubject<RestrictArray<Inputs> | null>(typeof inputs === 'undefined' ? null : inputs));

  function eventCallback(e: EventValue) {
    return event$.next(e);
  }
  const returnedCallback = useCallback(eventCallback, []);
  const justSetState = useCallback((state: State) => {
    state$.next(state);
    setState(state);
  }, []);

  useEffect(() => {
    inputs$.next(typeof inputs === 'undefined' ? null : inputs);
  }, inputs || []);

  useEffect(() => {
    const value$ = inputs ?
      (callback as EventCallback<EventValue, State, RestrictArray<Inputs> | null>)(event$, state$, inputs$ as any) :
      (callback as EventCallback<EventValue, State, void>)(event$, state$);

    const subscription = value$.subscribe(justSetState);
    return () => {
      subscription.unsubscribe();
      state$.complete();
      inputs$.complete();
      event$.complete();
    };
  }, []);

  return [state, returnedCallback, justSetState];
}
