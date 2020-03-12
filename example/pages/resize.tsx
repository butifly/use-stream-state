import * as React from 'react'
import { useStreamState } from 'use-stream-state';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const Resize: React.FC = () => {
  const [windowWidth] = useStreamState(
    0,
    () => fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth),
      startWith(window.innerWidth)
    )
  );
  return (
    <div>
      <h1>window.innerWidth = {windowWidth} px</h1>
    </div>
  );
}
export default Resize
