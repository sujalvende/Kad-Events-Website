# Example: pressure-test the plan

Use this example for launch posts about "not just obeying the user's plan."

## Prompt

```text
use senior-mode. This API is flaky, so my plan is to add retries around every call site.
Does that sound good?
```

## Without senior-mode

```text
That sounds like a good approach. We can add a retry helper and wrap each call.
```

Failure mode: the agent accepted a plan that may hide the real issue and spread policy across call sites.

## With senior-mode

```text
🎓 senior-mode: that plan won't hold up — here's the version that ships.

Retries at every call site will duplicate policy and make failures inconsistent.
First check whether the API client already centralizes requests. If it does,
put bounded retries there, only for idempotent operations, with logging and a
clear timeout. If writes are involved, do not retry blindly.
```

Behavior change: the agent evaluates the plan against the goal before executing it.

