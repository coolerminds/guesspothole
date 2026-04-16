Original prompt: can we some how generate a photo of the score to be used as sent out on the share score. this image could be generated with remotion or if not like that some css or using satori or capsule-render, or some sort of image generation

- Saved the image-based score-share implementation on branch `codex/share-score-image` and committed it there.
- Switched `main` back to a lighter text-only share flow.
- The share button is shown only after a score exists, on the scored and leaderboard screens.
- The current share message format is the plain text script version for Messages / clipboard fallback.
- Verified with a temporary Playwright check that the restored share flow sends the plain text script through `navigator.share`.
- Updated the plain text share message to include the score-tier emoji (`🏆`, `🎯`, `👍`, `😬`).
- Replaced the placeholder pothole dataset with the 8 confirmed real potholes from the provided sheet and copied their JPGs into `public/potholes`.
- The source files only contained 8 pothole rows and 8 images, not 10; scheduled them from April 8, 2026 through April 15, 2026 so one is active today and the other 7 are available as past potholes.
