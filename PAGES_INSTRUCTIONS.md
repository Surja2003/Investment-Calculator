GitHub Pages deployment notes
================================

If your Pages site is serving the repository source (showing a 404 for `/src/main.jsx`) it means Pages is configured to use the repository root instead of the GitHub Actions artifact upload.

Fix steps:

1. Open your repository on GitHub and go to Settings → Pages.
2. Under "Build and deployment", set "Source" to "GitHub Actions" (this will use the artifact produced by the `Deploy to GitHub Pages` workflow).
3. Save. Then re-run the `Deploy to GitHub Pages` workflow (Actions → select the most recent run → Re-run jobs).

Additional checks:
- Confirm the `deploy` workflow run succeeded and that the `Deploy to GitHub Pages` action completed without errors.
- Verify the workflow created the `dist` artifact (the workflow step `Upload artifact` uploads `dist`).
- The workflow already writes a `dist/.nojekyll` file to prevent Jekyll processing.

If you prefer I can:
- Open a PR that updates the workflow to print the Paths in `dist` after build, to verify contents.
- Add a health-check step which fails the build if `dist/index.html` is missing.
