let currEffect;

// API Functions
export const createSignal = (initValue) => {
  const signal = {
    value: initValue,
    dependencies: new Set(),
  };

  const addEffect = (signal) => {
    if (!currEffect) return;
    createDoubleSidedDependency(signal);
  };

  const createDoubleSidedDependency = (signal) => {
    currEffect.dependencies.add(signal);
    signal.dependencies.add(currEffect);
  };

  const getSignal = () => {
    addEffect(signal);
    return signal.value;
  };

  const setSignal = (value) => {
    signal.value = value;
    [...signal.dependencies].forEach((effect) => effect.run());
  };

  return [getSignal, setSignal];
};

export const createEffect = (callback) => {
  const effect = {
    run: () => {
      effect.cleanup();
      if (currEffect) {
        currEffect.nestedEffects.push(effect);
      }
      currEffect = effect;
      callback();
      currEffect = null;
    },
    cleanup: () => {
      effect.dependencies.forEach((signal) => signal.dependencies.clear());
      effect.nestedEffects.forEach((nestedEffect) => nestedEffect.cleanup());
      effect.dependencies.clear();
    },
    dependencies: new Set(),
    nestedEffects: [],
  };

  effect.run();
};
export const createMemo = (callback) => {
  const [getMemo, setMemo] = createSignal();
  createEffect(() => setMemo(callback()));
  return getMemo;
};
