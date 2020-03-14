# use-stream-state
React-hooks with RXjs

## Demo

- check is online - [link](https://codesandbox.io/s/useisonline-j9e5n)

```typescript jsx
const useOnline = () => {
  const [isOnline] = useStreamState(true, () =>
    merge(
      fromEvent(window, "online").pipe(mapTo(true)),
      fromEvent(window, "offline").pipe(mapTo(false))
    ).pipe(
      startWith(window.navigator.onLine),
      share()
    )
  );
  return isOnline;
}
```

- timer - [link](https://codesandbox.io/s/timer-pxdis)

- window resize event - [link](https://codesandbox.io/s/resize-event-r7sfk)
