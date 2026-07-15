# RyanFit Genesis Alpha — Tested Build

This package has been compiled successfully with:

```bash
npm install
npm run build
```

Upload the **contents of this folder** to the root of the `genesis` branch.
Do not press **Compare & pull request** and do not change GitHub Pages from `main` yet.

After committing, open **Actions → Genesis Build Check**. A green tick confirms GitHub compiled the same project successfully.

## Included Alpha features

- React + TypeScript + Vite foundation
- Persistent in-progress workout state
- Resume after interruption or reload
- Start set → countdown → active set → finish → automatic rest
- Previous weight and reps preloaded
- Shoulder-response logging per set
- Actual Plus Fitness Marleston machine photos
- Basic voice coach and diagnostics
- `Just Follow Me` workout flow

## Important

The old files inherited from `main` may still appear in the `genesis` branch. They do not power Genesis once this new `index.html`, `src`, `public`, `package.json`, and Vite configuration are present. We can clean obsolete files after the build check is green.
