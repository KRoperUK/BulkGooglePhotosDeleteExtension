# Changelog

## [1.5.1](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/v1.5.0...v1.5.1) (2026-10-24)


### Bug Fixes

* use English extension name in all locales to pass CWS review ([47ad654](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/47ad6548a827ab928893ce11dc6271a4088ff339))
* use English extension name in all locales to pass CWS review ([03ae1c1](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/03ae1c1f3c531333794d390bb2399afd2e0c7186)), closes [#44](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/issues/44)

## [1.5.0](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/v1.4.0...v1.5.0) (2026-10-23)


### Features

* localize Chrome Web Store listing (10 languages) via _locales ([c9ed025](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/c9ed025a7e184aa2a5fb411727782f45ae94c669))
* localize store listing for vi, th, uk, ar ([d0be9ca](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/d0be9caf9a7cbb329497403d9db04d234abe322b))
* localize store title and summary for nl, pl, tr, id ([ada95ca](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/ada95caed414bc82bcf4c15304b7a8a25b3bf4fc))
* localize store title and summary for vi, th, uk, ar ([3b96287](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/3b962872774c14903af0d23ca5aae791544095ef))
* localize store title and summary via _locales ([48ab52e](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/48ab52e64f6682c654f8af4f9f0be0036de523d0))

## [1.4.0](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/v1.3.0...v1.4.0) (2026-10-23)


### Features

* attach build and source archives to every release ([c9b9d27](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/c9b9d27a3752c29fe64f54809084375a93b2cd04))
* attach build and source archives to every release ([41f5ba6](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/41f5ba65a3d18808aff177764f76880af861d134))
* pause runs when the tab is backgrounded and show it in the panel ([209e415](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/209e4152511dde3e1e019958b08a2e70a774633b)), closes [#30](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/issues/30)


### Bug Fixes

* collapse duplicate entries in CHANGELOG.md ([f85091b](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/f85091b35161038f5f754e70bed9dc61783e4c58))
* collapse duplicate entries in CHANGELOG.md ([a9d1296](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/a9d1296d83327cfe729a8c71cf8e025b75af76d6))
* collapse duplicate entries in the release PR body ([399eecf](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/399eecf88f807fdd8b5f9cc54cc4a70bf0e7e5f1))
* collapse duplicate entries in the release PR body ([48b318e](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/48b318eba1002e3bebd86f0fa30808ff5501384a))
* collapse duplicate release-note entries ([c7c39eb](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/c7c39eb3aa70dbf20f65b12cd7b9862ac77a7e0e))
* collapse duplicate release-note entries ([a5d5d8d](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/a5d5d8d562927d0b2a3fd11208a4be49032f1acb))
* enforce batch size as a hard ceiling on deletions ([b6094bb](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/b6094bb4bb52341de26c22e236473ded441509ac)), closes [#29](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/issues/29)


### Performance Improvements

* scope selectionCount to the selection toolbar first ([2a20942](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/2a20942229fb6d3804ffe44f9c63098ef54de4f8)), closes [#33](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/issues/33)

## [1.3.0](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/v1.2.1...v1.3.0) (2026-10-23)


### Features

* collapse the panel to a bubble and verify each batch actually deleted ([bd7a48d](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/bd7a48d81f3edcf7796dcb9e358f68c1022e0833), [49b70cc](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/49b70ccd1049eaa1d3a3e854e838b14750455f42))
* open the panel expanded when the toolbar icon is clicked ([0e09f10](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/0e09f105df26aba4f890f4f8da17d2df4eef1e62), [aed386d](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/aed386d6abf14b559fd1a024452257d24296b245))
* use activeTab injection instead of host permissions ([a2eb11f](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/a2eb11f882bf052c8f52baf6b74c78d502a958cd), [49dee4f](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/49dee4fed5f32f4cffad7681e5f10c8a49bc4f42))


### Bug Fixes

* cap a batch by clicks performed instead of clicks verified ([4f3aaaa](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/4f3aaaa3064d79a249ccc3ff46921a10f6649c88))
* clear any carried-over selection before starting a run ([1d19a62](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/1d19a62ce0ad9ab74d51066fb087539fcb65c258), [578aab9](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/578aab9213219bf19b015144af38ee06630251d7))
* connect to the tab without the tabs permission, and enlarge the toolbar icon ([76a9e9b](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/76a9e9bcf74caaea7c597dfb399bbc76c926c5d6), [72202d1](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/72202d112fa1eccb420db6937d9fc9a81faf2617))
* draw the bubble icon inline instead of loading an extension file ([44e6406](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/44e6406dfbe56e947c969e8edb187b9857f1dd7b), [6c08ec3](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/6c08ec3b43a340af997054740c4b389731f05552))
* honour Stop promptly, validate the delete path in dry run, clear stale selections ([dde83d6](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/dde83d670c3c76031430bb9ec26dc3892d966e04), [90d3353](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/90d33537cde573c5a06249d17899e607874036cf))
* open the side panel from the action click so activeTab is granted ([d406a0f](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/d406a0fef95a7961c6daaf1c426721603aa400fb), [d9847dc](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/d9847dc4956ad83bcc02c7a5cb946dcc0b9255fb))
* recognise the empty library instead of treating it as a stuck grid ([ff2f7c1](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/ff2f7c1413d6bba2b6f41ecb85776f0fabc74a8f), [c8f193d](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/c8f193d56ada91e9be7eb5961db0174ddfea7e5d))
* wait for the grid to actually change before the next batch ([ddd4c6e](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/ddd4c6e457166224972b20c6122ecde4d1b1109c), [383f076](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/383f0762610a15f851bf161bbd8daca83b4d54de))

## [1.2.1](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/v1.2.0...v1.2.1) (2026-10-23)


### Bug Fixes

* stop giving up when the grid refreshes after a delete ([c9cc7e3](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/c9cc7e323f8f702d118ab17e236e7970b821853b), [c28fb07](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/c28fb0717338c55afd184f5a62ffd4367d28dfbc))

## [1.2.0](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/v1.1.0...v1.2.0) (2026-10-22)


### Features

* add loopback OAuth helper for the CWS refresh token ([837fbab](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/837fbab7fcf78a92eec937a385fd836b84f1dabc))

## [1.1.0](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/compare/bulk-delete-google-photos-v1.0.0...bulk-delete-google-photos-v1.1.0) (2026-10-22)


### Features

* add loopback OAuth helper for the CWS refresh token ([837fbab](https://github.com/KRoperUK/BulkGooglePhotosDeleteExtension/commit/837fbab7fcf78a92eec937a385fd836b84f1dabc))
