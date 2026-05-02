export function useCurrentOmnibarState() {
  const [state] = cartographer.useReplicant<Omnibar.State | null>('nodecg-omnibar', null, {
    namespace: 'nodecg-omnibar',
  });

  return state;
}

export function useOnMount(callback: React.EffectCallback): void {
  const savedCallback = cartographer.useRef<React.EffectCallback>();

  cartographer.useEffect(() => {
    savedCallback.current = callback;
  });

  cartographer.useEffect(() => {
    const onDismount = savedCallback.current?.();

    return (): void => {
      if (onDismount) onDismount();
    };
  }, []);
}