# Changelog

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
