import React from 'react'
import { useStreamState } from 'use-stream-state';
import { map, startWith, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { useEffect } from 'react';

const Index: React.FC = () => {
  const [increase1, setIncrease1] = useStreamState(
    0,
    (input$, state$) => input$.pipe(
      switchMap(() => timer(1000, 1000).pipe(
        map(() => state$.value + 1),
        startWith(0),
      )),
      ));

  useEffect(() => {
    setIncrease1(0);
  }, []);

  const [increase2] = useStreamState(0, (_, state$) => timer(1000, 1000).pipe(
    map(() => state$.value + 1),
    startWith(0),
  ));
  return (
    <div>
      Timer1: {increase1}ms. <button onClick={() => setIncrease1(0)}>restart</button><br />
      Timer2: ${increase2}ms.
    </div>
  );
};

export default Index;
