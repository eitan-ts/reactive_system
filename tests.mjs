// These imports should come from your reactive system implementation.
import { createSignal, createEffect, createMemo } from './index.mjs';

/**
 * Asserts a given actual value is deeply equals to expected one
 * In case values differ, it will throw a formatted error using the assertion message
 * @param message
 * @param actual
 * @param expected
 */
const assert = (message, actual, expected) => {
    if (actual !== expected) {
        throw new Error(`❌ [Assertion failed] ${message} | Actual: ${actual}, Expect: ${expected}  ❌`);
    }
}

const testSignalsScenarios = () => {
    const [count, setCount] = createSignal(0);
    assert('Signals should allow initial value', count(), 0);

    setCount(5);
    assert('Signals are mutated by their setters', count(), 5);
};

const testEffectsScenarios = () => {
    const basic = () => {
        let triggers = 0;
        const [count, setCount] = createSignal(0);
        const [second, setSecond] = createSignal(0);
        createEffect(() => {
            const unusedTrackedValue = count() * second(); // Triggers signals track
            triggers++;
        });

        assert('Effect runs upon initialization', triggers, 1);

        setCount(5);
        setSecond(10);

        // Initial run + 2 tracked signals mutations
        assert('Effects tracks signals dependencies', triggers, 3);
    }

    const dynamicTracking = () => {
        let triggers = 0;
        const [count, setCount] = createSignal(0);
        const [other, setOther] = createSignal('Hey');
        createEffect(() => {
            if (count() > 5) {
                const unusedTrackOther = other(); // Conditional signal
            }
            triggers++;
        });

        setOther('Tal');
        setCount(20);
        setOther('Eitan');

        // Initial + 2 registered mutations
        assert('Effects signals graph is dynamically built upon each run', triggers, 3);

        setCount(0);
        setOther('Oded');

        assert('Effects signals graph is dynamically built upon each run', triggers, 4);
    };

    basic();
    dynamicTracking();
};

const testMemoScenarios = () => {
    let displayNameCalculations = 0;
    let effectTriggers = 0;

    const [firstName] = createSignal("John");
    const [lastName, setLastName] = createSignal("Smith");
    const [showFullName, setShowFullName] = createSignal(true);

    const displayName = createMemo(() => {
        displayNameCalculations++;
        if (!showFullName()) return firstName();
        return `${firstName()} ${lastName()}`
    });

    assert('Memo runs upon creation', displayNameCalculations, 1);

    displayName();
    displayName();
    displayName();

    assert('Memo result is actually cached and memoized as long as no mutations was done on its signals', displayNameCalculations, 1);

    createEffect(() => {
        const unusedTrackedMemo = displayName();
        effectTriggers++;
    });

    setShowFullName(false);
    assert('Memo re-execute if one of its signals changes', displayNameCalculations, 2);
    assert('Effects re-execute if tracked Memo', effectTriggers, 2);

    setLastName("Legend");
    assert('Memo skips re-execute if tracked signal was removed', displayNameCalculations, 2);

    setShowFullName(true);
    setLastName("Legend");
    assert('Memo re-execute if one of its signals changes', displayNameCalculations, 4);
};

/**
 * Main test runner for our Reactive system.
 */
const main = () => {
    testSignalsScenarios();
    console.log(' ✅ Signal tests scenarios fully passed ✅ ');

    testEffectsScenarios();
    console.log(' ✅ Effect tests scenarios fully passed ✅ ');

    testMemoScenarios();
    console.log(' ✅ Memo tests scenarios fully passed ✅ ');
};

main();