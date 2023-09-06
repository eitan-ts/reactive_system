# Reactive System

My implementation of a reactive system which can be found on frontend frameworks such as solid.js, vue, angular etc.
Currently supports:

- `createSignal(initValue)` - Signals are the most basic Primitive our system will hold, they will hold a getter and a setter for an initial given value.
- `createEffect(callback)` - Effects are functions that wrap reads of our Signal and re-execute whenever a dependent Signal's value changes.
- `createMemo(callback)` - Memos are cached derived values. They share the properties of both Signals and Effects. They track their own dependent Signals, re-executing only when those change, and are trackable Signals themselves.

Including support for:

#### Effect "see Through"

Effects has the ability to "see through" other functions signals, for example:

```
const [count, setCount] = createSignal(0);

const getDoubleCount = () => count() * 2;

createEffect(() => {
  console.log('[Effect] Double count is', getDoubleCount())
});
```

In this example, even-tho the Effect isn't calling directly to count signal, it still tracks it as it's being used within the getDoubleCount method.

#### Dynamic dependencies tracking

Effects needs to have the ability to dynamically listen to Signals and be triggered accordingly.
