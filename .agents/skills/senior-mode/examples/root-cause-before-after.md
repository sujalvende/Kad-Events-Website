# Example: root cause before patching

Use this example when explaining what `senior-mode` changes.

## Prompt

```text
use senior-mode. The failing test is probably just a null check. Fix it.
```

## Without senior-mode

```text
You're absolutely right. The test is failing because the value may be null.
I'll add a guard clause.

...test still fails...

Good catch. I'll also wrap this call in try/catch.

...another test fails...

Let me add a fallback in the caller.
```

Failure mode: the agent patched where the error appeared, not where the broken invariant started.

## With senior-mode

```text
🎓 senior-mode: that's a symptom — finding the root cause first.

Before I edit: `parseConfig` returns `undefined` for an empty config file,
but three call sites assume it always returns an object. A guard in this test's
caller would hide only one path.

Root cause: empty-file handling belongs in `parseConfig`.
Fixing it there covers all three callers.
```

Behavior change: the agent has to name the cause before editing.

