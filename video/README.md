# Flow videos

Three short videos, one per demo flow, built with [Remotion](https://www.remotion.dev/).

The footage is real: each frame in `public/footage/` was captured from the Yardmaster dashboard
or from GitHub while the scenario ran through a local Yardmaster stack against this repository on
16 November 2026. The videos are time-lapses of those captures (one frame every few seconds), with
a statement before, narration below, and the Yardmaster logo after. The statement uses
[Remocn](https://remocn.dev/)'s `soft-blur-in` component.

| Composition | File | Flow |
| --- | --- | --- |
| `burst` | `out/burst.mp4` | Six pull requests arrive at once and merge one at a time |
| `semantic-conflict` | `out/semantic-conflict.mp4` | Two pull requests green alone, red together |
| `base-moves` | `out/base-moves.mp4` | `main` moves while a candidate is validating |

In the burst run, GitHub accepted the fourth validation run but never started it. That item was
cancelled in the dashboard and queued again, and the video says so.

```sh
pnpm install --frozen-lockfile
pnpm studio    # preview and edit
pnpm render    # write the three MP4 files to out/
```

Each flow's shots, timing and narration live in `src/flows/`. To refresh the footage, replace the
images in `public/footage/<flow>/` and adjust the shot list. Remotion has its own license: free
for individuals and small companies.
