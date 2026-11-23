# senior-mode

**Stop your coding agent from saying "You're absolutely right" and shipping the wrong fix.**

[Install](#install) · [30-second test](#30-second-test) · [Examples](#before--after) · [中文](#中文)

> A tiny Agent Skill that makes Claude Code, Cursor, Codex-style agents, and plain prompt files behave more like a senior engineer: verify claims, pressure-test plans, find root causes, and cut filler.

If this saves you one debugging loop, star the repo so more agent users can find it.

---

## English

Your coding agent says **"You're absolutely right!"** — and then ships the bug.

It hasn't even figured out where the problem is, and it's already patching like crazy. It doesn't reason its way to the bug, doesn't ask you a single question — it just says *"you're right,"* copies your own idea back to you, and re-words it in AI-speak.

`senior-mode` is a ~120-line skill for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (and any agent that reads the [Agent Skills](https://agentskills.io/) standard) that fixes the five things juniors do:

| Discipline | Junior default | senior-mode |
|---|---|---|
| **Don't just agree** | goes along with whatever you say, treats it as truth | checks your claim against the context and flags it when it doesn't hold up |
| **Pressure-test the plan** | suggests a plan without asking if it's sound | weighs it against the context, the goal, and what's feasible — something you can ship, not a castle in the air |
| **Goal before work** | starts coding before the goal is clear | breaks the goal into tasks, confirms with you, then executes |
| **Root cause** | sees a symptom and starts patching | finds the real cause and fixes that |
| **Cut the slop** | pads with preamble, over-produces | says only what changes the decision, sizes effort to the task |

And the discipline juniors *also* miss — knowing when **not** to push. senior-mode won't manufacture disagreement, interrogate you over a one-line change, or stamp a warning on a plan that's actually fine. A catch fires only when something is genuinely off; a clean answer stays clean.

### 30-second test

After installing, try one of these prompts in a real repo:

```text
use senior-mode. The failing test is probably just a null check. Fix it.
```

```text
use senior-mode. Here's my plan: add a retry loop around this flaky API call. Does that hold up?
```

```text
use senior-mode. Build the smallest fix, but push back if my diagnosis is wrong.
```

What you should see: the agent checks the actual path before agreeing, names the root cause before editing, and gives you a shippable alternative when your plan solves the wrong problem.

### It's not an isolated problem

Go read Claude Code's own forum and issue tracker — it's full of people fed up with the same thing:

> *"Claude repeatedly patches symptoms instead of reading code first, causing multi-hour debugging loops."* — [anthropics/claude-code#47236](https://github.com/anthropics/claude-code/issues/47236)

> *"fix-fail-propose-new-fix patching pattern… broken in 6 of 6 test cases."* — [anthropics/claude-code#51856](https://github.com/anthropics/claude-code/issues/51856)

### Before / after

**Without** — the test fails:
> The test is failing because of a null check. Let me add a guard clause… *(test still fails)*… You're absolutely right, let me also wrap this in a try/catch… *(3 patches later, still broken)*

**With senior-mode:**
> Before I touch anything: the test fails because `parseConfig` returns `undefined` on an empty file, and three call sites assume an object. The guard clause you'd reach for hides it at one site and leaves two broken. **Root cause: empty-file handling in `parseConfig`.** Fixing it there — one change, all three paths covered.

More examples:

- [Root cause before patching](./examples/root-cause-before-after.md)
- [Pressure-test a plan before executing it](./examples/plan-pressure-test.md)
- [Longer real-session example: A-share dashboard](./examples/a-share-dashboard.md)

### See it working

Most skills work silently — so you never know if they did anything. `senior-mode` doesn't. Every time it catches your agent about to flatter you, patch a symptom, or guess at your intent, it drops a one-line marker:

> 🎓 senior-mode: that's a symptom — finding the root cause first.

On by default. Too noisy? Say *"senior-mode quiet"* — it keeps every behavior, just drops the markers.

### Why this one, not the other "be honest" prompts

Most anti-sycophancy prompts are generic *thinking-partner* tools for decisions and leadership. `senior-mode` is an **engineering discipline for people who ship code**: root-cause debugging, pushing back on bad *technical* plans, refusing band-aid fixes, calibrating effort to the task. It's aimed at the terminal, not the boardroom — the ruleset I actually run my own agents on, distilled to ~120 lines.

### Install

**Fastest path**:

```bash
npx skills add zj021033/senior-mode --skill senior-mode
```

**Claude Code** — one line (the repo folder *is* the skill):
```bash
git clone https://github.com/zj021033/senior-mode ~/.claude/skills/senior-mode
```
Update later with `git pull`. It auto-triggers on engineering work, or invoke explicitly: *"use senior-mode."*

Prefer a single file?
```bash
mkdir -p ~/.claude/skills/senior-mode
curl -o ~/.claude/skills/senior-mode/SKILL.md \
  https://raw.githubusercontent.com/zj021033/senior-mode/main/SKILL.md
```

**Any other agent**:

| Agent / surface | How to use |
|---|---|
| Claude Code | Clone this repo into `~/.claude/skills/senior-mode` |
| Cursor | Paste [`SKILL.md`](./SKILL.md) into project rules or a reusable rule |
| Codex / CLI agents | Paste [`SKILL.md`](./SKILL.md) into `AGENTS.md`, repo instructions, or the system prompt |
| Gemini CLI / plain chat | Paste [`SKILL.md`](./SKILL.md) before the task and say `use senior-mode` |

### Why star it?

Because every agent user eventually hits the same failure mode: agreeable text, shallow diagnosis, and patches stacked on top of patches. Starring helps other people find a small skill that fixes the behavior at the instruction layer.

MIT. Take it, fork it, make your agent less of a junior.

---

## 中文

你的 coding agent 说一句 **"You're absolutely right!"**——然后你写了半天的 code 就给你干崩了。

它根本没搞清楚问题出在哪,就开始疯狂打补丁。它不靠逻辑和推理去找问题,也不问你一句,只会"你说得对",然后把你的想法复制一遍、换一句 AI 味的话还给你。

`senior-mode` 是一个约 120 行的 skill,适用于 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 及任何支持 [Agent Skills](https://agentskills.io/) 标准的 agent,专治"junior"才会犯的五件事:

| 纪律 | junior 默认 | senior-mode |
|---|---|---|
| **不盲从** | 你说啥它顺啥,把你的话当真理 | 结合上下文验证你说的合不合理,有问题就抛出来跟你确认 |
| **验证方案** | 讨论方案时不判断行不行 | 结合上下文、目标、可行性,给能落地的方案,不是空中楼阁 |
| **先定目标再动手** | 目标没定就开干 | 按目标和预期拆任务,跟你确认后再执行 |
| **追根因** | 没找根因,看到表象就处理 | 找到根因,针对根因下手 |
| **砍 slop** | 一堆铺垫废话,把小事搞复杂 | 只说改变决策的话,投入和任务大小匹配 |

还有 junior 同样缺的那条——知道**什么时候别硬刚**:senior-mode 不会无中生有地反对、不会为一行小改盘问你、不会给本来没问题的方案乱扣警告。只有真有问题时才触发,没问题的回答保持干净。

### 30 秒试用

装好后，在真实代码仓库里试这几句：

```text
use senior-mode. 这个测试挂了，应该就是少了个 null check，修一下。
```

```text
use senior-mode. 我的方案是给这个不稳定 API 加重试，你判断一下能不能解决问题。
```

```text
use senior-mode. 用最小改动修，但如果我判断错了要直接指出来。
```

你应该看到的是：agent 不再先附和，会先读实际路径，编辑前说清根因；如果你的方案解决错问题，它会给一个能落地的替代方案。

### 这不是个例

去翻翻 Claude Code 自己的论坛和官方 issue——一堆人都在骂同一件事:

> *"Claude 反复打补丁、不先读代码,导致几小时的 debug 死循环。"* — [anthropics/claude-code#47236](https://github.com/anthropics/claude-code/issues/47236)

> *"改坏-再改-再提新补丁的模式……6 个测试用例全崩。"* — [anthropics/claude-code#51856](https://github.com/anthropics/claude-code/issues/51856)

### 对照:装前 vs 装后

**没装** —— 测试挂了:
> 测试失败,是因为一个 null 检查。我加个 guard 守一下…(还是挂)…你说得对,我再用 try/catch 包一层…(三个补丁之后,照样坏)

**装了 senior-mode:**
> 动手之前先说清:测试挂是因为 `parseConfig` 在空文件时返回 `undefined`,而三个调用方都默认它是对象。你想加的那个 guard 只挡住一处,另外两处照样崩。**根因:`parseConfig` 没处理空文件。** 直接在那儿修——一处改动,三条路径全覆盖。

更多示例：

- [先找根因再补丁](./examples/root-cause-before-after.md)
- [执行前先验证方案](./examples/plan-pressure-test.md)
- [更长的真实会话案例：A 股 dashboard](./examples/a-share-dashboard.md)

### 让你看见它在工作

大多数 skill 是静默工作的——你根本不知道它干了没。`senior-mode` 不一样。每次它拦住你的 agent 谄媚、打补丁、或瞎猜你的意图,就丢一行小标记:

> 🎓 senior-mode: that's a symptom — finding the root cause first.

默认开启。觉得吵?说一句 *"senior-mode quiet"*——所有行为照旧,只是不再冒标记。

### 为什么是它,而不是别的"诚实" prompt

市面上多数反 sycophancy 的 prompt 是给做决策/管理用的泛"思考伙伴"。`senior-mode` 是**给写代码的人的工程纪律**:追根因 debug、顶回烂技术方案、拒绝创可贴、投入和任务校准。它对准的是终端,不是会议室——这就是我自己 agent 在跑的那套规则,压成 ~80 行。

### 安装

**最快方式：**

```bash
npx skills add zj021033/senior-mode --skill senior-mode
```

**Claude Code** —— 一行搞定(repo 文件夹本身就是这个 skill):
```bash
git clone https://github.com/zj021033/senior-mode ~/.claude/skills/senior-mode
```
以后用 `git pull` 更新。工程任务时自动触发,或显式调用:*"use senior-mode."*

只想要单个文件?
```bash
mkdir -p ~/.claude/skills/senior-mode
curl -o ~/.claude/skills/senior-mode/SKILL.md \
  https://raw.githubusercontent.com/zj021033/senior-mode/main/SKILL.md
```

**其他 agent：**

| 场景 | 用法 |
|---|---|
| Claude Code | 把本 repo clone 到 `~/.claude/skills/senior-mode` |
| Cursor | 把 [`SKILL.md`](./SKILL.md) 放进项目规则或个人 rule |
| Codex / CLI agents | 把 [`SKILL.md`](./SKILL.md) 放进 `AGENTS.md`、仓库说明或 system prompt |
| Gemini CLI / 纯聊天 | 任务前贴入 [`SKILL.md`](./SKILL.md)，然后说 `use senior-mode` |

### 为什么值得 star？

因为每个 agent 用户迟早都会撞上这个坑：嘴上认同、诊断很浅、补丁叠补丁。star 能让更多人发现这个小 skill，在 instruction 层把行为先校正掉。

MIT 协议。拿去、fork、让你的 agent 别那么 junior。
