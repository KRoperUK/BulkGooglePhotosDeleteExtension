# Security Policy

## Supported versions

Only the latest published version on the Chrome Web Store is supported. The
extension auto-updates, so please confirm you are on the newest version before
reporting.

## Reporting a vulnerability

Please report security issues **privately**, not as a public issue or PR.

- Open a [private security advisory](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/security/advisories/new), or
- email the maintainer (see the GitHub profile for `@KRoperUK`).

Include what the issue is, how to reproduce it, and the impact you foresee.
You will get an acknowledgement as soon as possible. Once a fix ships, you are
welcome to be credited in the advisory.

## Scope and threat model

This extension is deliberately small and self-contained:

- It makes **no network requests**, has no backend, and stores nothing.
- It declares no host permissions; it uses `activeTab` and is injected only when
  the user clicks the toolbar icon on `photos.google.com`.
- It only ever acts on the Google account already signed into the current tab.

Security-relevant concerns we care most about:

- Anything that would cause the extension to act on a site other than
  `photos.google.com`, or to run without an explicit user gesture.
- Any change that could delete more than the user requested, or delete on the
  Bin (`/trash`) page where deletion is permanent.
- Introduction of a network request, remote code, or data exfiltration.

Because deletions are destructive, bugs in the selection/delete path are treated
as security-adjacent even when they are not classic vulnerabilities.
