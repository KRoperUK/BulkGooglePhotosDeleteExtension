# Chrome Web Store publishing setup

Everything below is one-time. After it's done, releases are fully automatic.

## 1. Create the store item

1. Register as a Chrome Web Store developer at <https://chrome.google.com/webstore/devconsole> (one-time US$5 fee) and verify your contact email.
2. Click **New item**, upload any build of this extension (the first upload creates a draft), and give it a name and description.
3. Note the **extension ID** from the item's URL:
   `https://chrome.google.com/webstore/devconsole/<publisher-id>/<extension-id>/edit`

   This item's ID is `laeijompklaebgbmhoehbefjmfcaohnf`.

The API can only update an item that already exists, so this manual first upload is unavoidable.

## 2. Create OAuth credentials

1. In <https://console.cloud.google.com/apis/credentials>, create an **OAuth client ID** of type **Desktop app**.
2. Copy the client ID and client secret.
3. Get a refresh token with the `chromewebstore` scope, using the
   [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):
   - Gear icon → tick **Use your own OAuth credentials** → paste your client ID and secret
   - In **Input your own scopes**, enter: `https://www.googleapis.com/auth/chromewebstore`
   - **Authorize APIs** → sign in with the account that owns the store item
   - **Exchange authorization code for tokens** → copy the **refresh token**

The refresh token is long-lived; treat it like a password. Do not paste it into an issue, PR, or commit.

## 3. Add repository secrets

```bash
gh secret set CWS_EXTENSION_ID   --repo KRoperUK/BulkGooglePhotosDeleteExtension
gh secret set CWS_PUBLISHER_ID   --repo KRoperUK/BulkGooglePhotosDeleteExtension
gh secret set CWS_CLIENT_ID      --repo KRoperUK/BulkGooglePhotosDeleteExtension
gh secret set CWS_CLIENT_SECRET  --repo KRoperUK/BulkGooglePhotosDeleteExtension
gh secret set CWS_REFRESH_TOKEN  --repo KRoperUK/BulkGooglePhotosDeleteExtension
```

Each command prompts for the value, so the secret never lands in shell history.

## 4. Allow the release PR to be created

Release Please opens pull requests using the default `GITHUB_TOKEN`. GitHub blocks that by default:

**Settings → Actions → General → Workflow permissions** →
tick **Allow GitHub Actions to create and approve pull requests**, then **Save**.

Without this, `release-please` fails with `GitHub Actions is not permitted to create or approve pull requests`.

## 5. How a release happens

1. Push commits to `main` using [Conventional Commits](https://www.conventionalcommits.org/):
   - `fix: …` → patch
   - `feat: …` → minor
   - `feat!: …` or a `BREAKING CHANGE:` footer → major
2. Release Please opens (and keeps updating) a **release PR** that bumps `manifest.json`, updates `CHANGELOG.md`, and the `.release-please-manifest.json`.
3. Merge that PR. Release Please creates the tag and GitHub Release.
4. The `Publish to Chrome Web Store` workflow fires on `release: published`, checks the tag matches `manifest.json`, builds the zip, uploads it, and requests publication.

### First release

`.release-please-manifest.json` is already at `1.0.0` and `manifest.json` is `1.0.0`, so the first automatic release will be a minor bump to `1.1.0` from a `feat:` commit. To ship `1.0.0` first, publish the GitHub Release manually:

```bash
gh release create v1.0.0 --repo KRoperUK/BulkGooglePhotosDeleteExtension --generate-notes
```

That tag matches `manifest.json`, so the publish workflow runs normally.

## Notes

- The uploaded zip contains only `manifest.json`, `content.js` and `icons/`. Screenshots, docs and workflows are excluded.
- `publish: true` submits for review; it does not bypass Google's review. Expect a delay after each upload.
- If the tag and `manifest.json` disagree, the workflow fails on purpose rather than shipping a wrong version.
