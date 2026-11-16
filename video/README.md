# Flow videos

Three short videos, one per demo flow, built with [Remotion](https://www.remotion.dev/) and two
[Remocn](https://remocn.dev/) components (`soft-blur-in`, `terminal-simulator`).

They are scripted reconstructions: every screen is drawn from code and nothing is captured from
GitHub or the Yardmaster dashboard. Each video says so on its last frame.

| Composition | File | Flow |
| --- | --- | --- |
| `burst` | `out/burst.mp4` | Six pull requests arrive at once and merge one at a time |
| `semantic-conflict` | `out/semantic-conflict.mp4` | Two pull requests green alone, red together |
| `base-moves` | `out/base-moves.mp4` | `main` moves while a candidate is validating |

```sh
pnpm install --frozen-lockfile
pnpm studio    # preview and edit
pnpm render    # write the three MP4 files to out/
```

Each flow's timing and copy live in `src/flows/`. Shared screens are in `src/components/ui.tsx`.
Remotion has its own license: free for individuals and small companies.
