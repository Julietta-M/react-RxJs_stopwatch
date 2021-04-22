import React, { useEffect, useState } from 'react';
import './App.css';

import { interval, Subject } from 'rxjs';
import { takeUntil, buffer, map, filter, debounceTime } from 'rxjs/operators';

function App() {
  const [time, setTime] = useState(0);
  const [state, setState] = useState('stop');

  const click$ = new Subject();

  useEffect(() => {
    const doubleClick$ = click$.pipe(
      buffer(
        click$.pipe(debounceTime(300)),
      ),
      map(list => list.length),
      filter(x => x === 2),
    );

    const timer$ = new Subject();

    interval(1000)
      .pipe(takeUntil(timer$))
      .subscribe(() => {
        if (state === 'start') {
          setTime(val => val + 1);
        }
      });

    return () => {
      timer$.next();
      timer$.complete();
    };
  }, [state, click$]);

  const start = () => {
    setState('start');
  };

  const stop = () => {
    setState('stop');
    setTime(0);
  };

  const reset = () => {
    setTime(0);
  };

  const wait = () => {
    click$.next();
    setState('wait');
    click$.next();
  };

  const formatTime = () => {
    const getSeconds = `0${(time % 60)}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  return (
    <div className="container shadow-sm p-3 mb-5 bg-body rounded">
      <div className="date">
        {formatTime()}
      </div>
      <button
        className="btn btn-success"
        type="button"
        onClick={start}
      >
        Start
      </button>
      <button
        className="btn btn-danger"
        type="button"
        onClick={stop}
      >
        Stop
      </button>
      <button
        className="btn btn-primary"
        type="button"
        onClick={reset}
      >
        Reset
      </button>
      <button
        className="btn btn-warning"
        type="button"
        onClick={wait}
      >
        Wait
      </button>
    </div>
  );
}

export default App;
