# Chrome Web Store listing — localized copy

Translations of the store listing for the top Chrome Web Store languages.

## What ships automatically vs. what you paste

The Chrome Web Store API (used by the publish workflow) can upload the **package**
and toggle publish — it **cannot** set listing text, screenshots or promo tiles.
So the two halves of this file are applied differently:

| Field | Source | Updates via release? |
|---|---|---|
| **Summary** (≤132 chars) | package — `_locales/<lang>/messages.json` → `extDesc` | **Yes.** Ships in the zip; the store derives the localized summary from the package. |
| **Title** | package — `extName` | **Yes**, same mechanism. |
| **Full description** | Developer Dashboard, per language | **No.** Paste manually (Store listing → language selector). |
| **Screenshots / promo tiles** | Developer Dashboard | No. |

The summaries below are the same strings as `_locales/<lang>/messages.json`, kept
here for review. Edit the `messages.json` files, not this table — CI
(`tools/validate-locales.mjs`) enforces the 132-char limit on them.

## Summaries (≤132 chars) — these ship in the package

| Locale | Language | Summary |
|---|---|---|
| `en` | English | Mass delete Google Photos in batches to free up storage. Dry-run preview, typed confirm, stop control, no limits, no network. |
| `es` | Spanish | Borra fotos de Google Photos en lote para liberar espacio. Vista previa de prueba, confirmación, control de parada, sin límites. |
| `pt_BR` | Portuguese (Brazil) | Exclua fotos do Google Fotos em lote para liberar espaço. Prévia de teste, confirmação digitada, botão parar, sem limites. |
| `fr` | French | Supprimez des photos Google Photos en lot pour libérer de l'espace. Aperçu à blanc, confirmation, bouton stop, sans limite. |
| `de` | German | Google Fotos stapelweise löschen und Speicher freigeben. Testlauf-Vorschau, Bestätigung, Stopp-Taste, keine Limits, offline. |
| `it` | Italian | Elimina foto di Google Foto in blocco per liberare spazio. Anteprima di prova, conferma, pulsante stop, nessun limite. |
| `ja` | Japanese | Google フォトを一括削除して空き容量を確保。ドライラン（選択のみ）、入力確認、停止ボタン、上限なし、通信なし。 |
| `ko` | Korean | Google 포토를 일괄 삭제해 저장용량을 확보하세요. 드라이런 미리보기, 입력 확인, 중지 버튼, 제한 없음, 네트워크 통신 없음. |
| `ru` | Russian | Массовое удаление фото Google Фото партиями для освобождения места. Пробный прогон, подтверждение, стоп, без лимитов, офлайн. |
| `zh_CN` | Chinese (Simplified) | 批量删除 Google 相册照片，释放存储空间。支持试运行预览、输入确认、停止按钮，无数量限制，无网络请求。 |
| `hi` | Hindi | Google Photos को बैच में मास-डिलीट कर स्टोरेज खाली करें। ड्राई-रन प्रीव्यू, पुष्टि, स्टॉप बटन, कोई सीमा नहीं, कोई नेटवर्क नहीं। |
| `nl` | Dutch | Verwijder Google Foto's in bulk, in batches, om opslag vrij te maken. Testrun, bevestiging, stopknop, geen limieten, offline. |
| `pl` | Polish | Masowo usuwaj zdjęcia z Google Zdjęć partiami, aby zwolnić miejsce. Tryb próbny, potwierdzenie, stop, bez limitów, offline. |
| `tr` | Turkish | Google Fotoğraflar'ı toplu olarak gruplar halinde silip depolama alanı açın. Deneme modu, onay, durdurma, sınır yok, çevrimdışı. |
| `id` | Indonesian | Hapus massal Google Foto per batch untuk mengosongkan penyimpanan. Mode uji coba, konfirmasi, tombol stop, tanpa batas, offline. |

> Product-name note: Google localizes the product name itself — "Google Fotos"
> (de/pt), "Google Foto" (it/id/nl¹), "Google 포토" (ko), "Google 相册" (zh),
> "Google Фото" (ru), "Google Fotoğraflar" (tr), "Google Zdjęcia" (pl). The English
> brand is kept where Google commonly leaves it in Latin script (es/fr/hi/ja).
> Verify against the current in-product strings if you want exact parity.
>
> ¹ Dutch uses the possessive "Google Foto's" for the plural.

---

## Full descriptions — paste into the Dashboard per language

The English source lives in [STORE-LISTING.md](STORE-LISTING.md). Each translation
keeps the same structure (overview → FEATURES → COMMON USES → PRIVACY → SAFETY →
NOTE). The trademark disclaimer in NOTE is translated alongside.

### Spanish (`es`)

```
Bulk Delete Google Photos es una herramienta pequeña y local para vaciar una biblioteca de Google Photos rápidamente: selecciona y elimina en lote miles de fotos y vídeos, porque la propia interfaz de Google hace poco práctico seleccionar tantos elementos a mano.

Google Photos no tiene un botón de "seleccionar todo" ni de "eliminar todo", y arrastrar para seleccionar decenas de miles de elementos es lento y propenso a errores. Esta extensión añade un panel lateral a photos.google.com que automatiza los clics que harías tú: selecciona un lote, pulsa Eliminar, confirma, espera a que se recargue la cuadrícula y repite, para vaciar una cuenta o liberar espacio sin pasar el día haciendo clic.

FUNCIONES

• Borrado masivo por lotes: selecciona todo lo visible o un tamaño de lote fijo, y desplaza la cuadrícula para seguir cargando
• Modo de prueba: selecciona y cuenta sin eliminar, para comprobarlo antes de confirmar
• Progreso en vivo: elementos eliminados, número de lote, fase y tiempo transcurrido
• Botón de parada que detiene de inmediato
• Límite máximo opcional por ejecución
• Confirmación escrita obligatoria antes de eliminar (activada por defecto)
• Funciona con la vista Archivo
• Alrededor de 20 idiomas de interfaz

USOS HABITUALES

• Borrar todas las fotos de una cuenta antigua o secundaria
• Liberar espacio de almacenamiento eliminando miles de fotos y vídeos antiguos
• Vaciar una cuenta compartida o de prueba antes de entregarla
• Eliminar lotes grandes que la interfaz web es demasiado lenta para seleccionar a mano

PRIVACIDAD

• Sin solicitudes de red. La extensión no contacta con ningún servidor, incluido el nuestro: no existe.
• Sin analítica, sin telemetría, sin almacenamiento local, sin cuentas.
• Sin permisos de host. Solo se ejecuta en photos.google.com, y solo tras pulsar el botón de la barra.
• No se recopila, vende ni transmite nada.

SEGURIDAD

• Las eliminaciones van a la Papelera, no al olvido: recuperables durante 30 días
• La extensión se niega a ejecutarse en la Papelera, porque allí el borrado es permanente
• Solo actúa sobre la cuenta ya conectada en la pestaña que usas

NOTA

Herramienta no oficial. No está afiliada a Google ni respaldada o patrocinada por Google. "Google Photos" es una marca de Google LLC, usada solo para describir con qué funciona la extensión.
```

### Portuguese — Brazil (`pt_BR`)

```
Bulk Delete Google Photos é uma ferramenta pequena e local para esvaziar uma biblioteca do Google Fotos rapidamente: seleciona e exclui em lote milhares de fotos e vídeos, porque a própria interface do Google torna impraticável selecionar tantos itens manualmente.

O Google Fotos não tem botão de "selecionar tudo" nem de "excluir tudo", e arrastar para selecionar dezenas de milhares de itens é lento e sujeito a erros. Esta extensão adiciona um painel lateral ao photos.google.com que automatiza os cliques que você faria à mão: seleciona um lote, pressiona Excluir, confirma, aguarda a grade recarregar e repete — para esvaziar uma conta ou liberar espaço sem passar o dia clicando.

RECURSOS

• Exclusão em massa por lotes: selecione tudo o que está visível ou um tamanho de lote fixo, rolando a grade para carregar mais
• Modo de teste: seleciona e conta sem excluir, para verificar antes de confirmar
• Progresso ao vivo: itens excluídos, número do lote, fase e tempo decorrido
• Botão de parar que interrompe imediatamente
• Limite máximo opcional por execução
• Confirmação digitada obrigatória antes de excluir (ativada por padrão)
• Funciona com a visualização Arquivo
• Cerca de 20 idiomas de interface

USOS COMUNS

• Excluir todas as fotos de uma conta antiga ou secundária
• Liberar espaço de armazenamento excluindo milhares de fotos e vídeos antigos
• Esvaziar uma conta compartilhada ou de teste antes de repassá-la
• Remover grandes lotes que a interface web é lenta demais para selecionar manualmente

PRIVACIDADE

• Sem requisições de rede. A extensão nunca contata nenhum servidor, incluindo o nosso — não existe um.
• Sem análise, sem telemetria, sem armazenamento local, sem contas.
• Sem permissões de host. Só roda em photos.google.com, e só depois que você clica no botão da barra.
• Nada é coletado, vendido ou transmitido.

SEGURANÇA

• As exclusões vão para a Lixeira, não para o nada — recuperáveis por 30 dias
• A extensão se recusa a rodar na Lixeira, porque lá a exclusão é permanente
• Só age na conta já conectada na aba que você está usando

OBSERVAÇÃO

Ferramenta não oficial. Não é afiliada, endossada ou patrocinada pelo Google. "Google Fotos" é uma marca da Google LLC, usada apenas para descrever com o que a extensão funciona.
```

### French (`fr`)

```
Bulk Delete Google Photos est un petit outil local pour vider rapidement une bibliothèque Google Photos : il sélectionne et supprime par lots des milliers de photos et vidéos, car l'interface de Google rend peu pratique la sélection manuelle d'autant d'éléments.

Google Photos n'a pas de bouton « tout sélectionner » ni « tout supprimer », et faire glisser pour sélectionner des dizaines de milliers d'éléments est lent et source d'erreurs. Cette extension ajoute un panneau latéral à photos.google.com qui automatise les clics que vous feriez à la main : sélectionner un lot, appuyer sur Supprimer, confirmer, attendre le rechargement de la grille et recommencer — pour vider un compte ou libérer de l'espace sans y passer la journée.

FONCTIONNALITÉS

• Suppression groupée par lots : sélectionnez tout ce qui est visible ou une taille de lot fixe, la grille défile pour en charger plus
• Mode à blanc : sélectionne et compte sans supprimer, pour vérifier avant de valider
• Progression en direct : éléments supprimés, numéro de lot, phase et temps écoulé
• Bouton d'arrêt qui stoppe immédiatement
• Plafond optionnel par exécution
• Confirmation saisie obligatoire avant toute suppression (activée par défaut)
• Compatible avec la vue Archives
• Une vingtaine de langues d'interface

CAS D'USAGE COURANTS

• Supprimer toutes les photos d'un ancien compte ou d'un compte secondaire
• Libérer de l'espace de stockage en supprimant des milliers d'anciennes photos et vidéos
• Vider un compte partagé ou de test avant de le transmettre
• Retirer de grands lots que l'interface web est trop lente à sélectionner à la main

CONFIDENTIALITÉ

• Aucune requête réseau. L'extension ne contacte aucun serveur, y compris le nôtre — il n'y en a pas.
• Aucune analyse, aucune télémétrie, aucun stockage local, aucun compte.
• Aucune permission d'hôte. Elle ne s'exécute que sur photos.google.com, et seulement après un clic sur le bouton.
• Rien n'est collecté, vendu ni transmis.

SÉCURITÉ

• Les suppressions vont à la Corbeille, pas dans le vide — récupérables pendant 30 jours
• L'extension refuse de s'exécuter sur la Corbeille, car la suppression y est définitive
• Elle n'agit que sur le compte déjà connecté dans l'onglet utilisé

REMARQUE

Outil non officiel. Non affilié à Google, ni approuvé ni sponsorisé par Google. « Google Photos » est une marque de Google LLC, utilisée uniquement pour décrire ce avec quoi l'extension fonctionne.
```

### German (`de`)

```
Bulk Delete Google Photos ist ein kleines, lokales Werkzeug, um eine Google-Fotos-Mediathek schnell zu leeren: Es wählt tausende Fotos und Videos stapelweise aus und löscht sie, weil Googles eigene Oberfläche es unpraktisch macht, so viele von Hand zu markieren.

Google Fotos hat keinen „Alle auswählen"- oder „Alles löschen"-Knopf, und zehntausende Elemente per Ziehen zu markieren ist langsam und fehleranfällig. Diese Erweiterung fügt photos.google.com ein Seitenpanel hinzu, das genau die Klicks automatisiert, die Sie sonst selbst machen würden: Stapel auswählen, Löschen drücken, bestätigen, auf das Neuladen des Rasters warten, wiederholen — um ein Konto zu leeren oder Speicher freizugeben, ohne den ganzen Tag zu klicken.

FUNKTIONEN

• Stapel-/Massenlöschung: alles Sichtbare oder eine feste Stapelgröße auswählen, das Raster scrollt für mehr
• Testlauf-Modus: auswählen und zählen ohne Löschen, um es vorher zu prüfen
• Live-Fortschritt: gelöschte Elemente, Stapelnummer, Phase und verstrichene Zeit
• Stopp-Taste, die sofort anhält
• Optionale Obergrenze pro Durchlauf
• Getippte Bestätigung vor dem Löschen erforderlich (standardmäßig an)
• Funktioniert mit der Archiv-Ansicht
• Rund 20 Oberflächensprachen

HÄUFIGE ANWENDUNGEN

• Alle Fotos eines alten oder zweiten Kontos löschen
• Speicher freigeben, indem tausende alte Fotos und Videos entfernt werden
• Ein geteiltes oder Test-Konto vor der Weitergabe leeren
• Große Stapel entfernen, die die Weboberfläche zu langsam von Hand markiert

DATENSCHUTZ

• Keine Netzwerkanfragen. Die Erweiterung kontaktiert keinen Server, auch nicht unseren — es gibt keinen.
• Keine Analyse, keine Telemetrie, kein lokaler Speicher, keine Konten.
• Keine Host-Berechtigungen. Sie läuft nur auf photos.google.com und nur nach einem Klick auf die Schaltfläche.
• Es wird nichts erfasst, verkauft oder übertragen.

SICHERHEIT

• Löschungen landen im Papierkorb, nicht im Nichts — 30 Tage wiederherstellbar
• Die Erweiterung verweigert die Ausführung im Papierkorb, weil Löschen dort endgültig ist
• Sie wirkt nur auf das im Tab bereits angemeldete Konto

HINWEIS

Inoffizielles Werkzeug. Nicht mit Google verbunden, von Google unterstützt oder gesponsert. „Google Fotos" ist eine Marke von Google LLC und wird nur verwendet, um zu beschreiben, womit die Erweiterung arbeitet.
```

### Italian (`it`)

```
Bulk Delete Google Photos è un piccolo strumento locale per svuotare rapidamente una libreria di Google Foto: seleziona ed elimina in blocco migliaia di foto e video, perché l'interfaccia di Google rende poco pratico selezionarne così tanti a mano.

Google Foto non ha un pulsante "seleziona tutto" né "elimina tutto", e trascinare per selezionare decine di migliaia di elementi è lento e soggetto a errori. Questa estensione aggiunge un pannello laterale a photos.google.com che automatizza i clic che faresti tu: seleziona un blocco, premi Elimina, conferma, attendi il ricaricamento della griglia e ripeti — per svuotare un account o liberare spazio senza passarci la giornata.

FUNZIONI

• Eliminazione in blocco: seleziona tutto il visibile o una dimensione fissa del blocco, scorrendo la griglia per caricarne altri
• Modalità di prova: seleziona e conta senza eliminare, per verificare prima di confermare
• Avanzamento in tempo reale: elementi eliminati, numero del blocco, fase e tempo trascorso
• Pulsante di stop che si ferma subito
• Limite massimo opzionale per esecuzione
• Conferma digitata obbligatoria prima di eliminare (attiva per impostazione predefinita)
• Funziona con la vista Archivio
• Circa 20 lingue dell'interfaccia

USI COMUNI

• Eliminare tutte le foto di un account vecchio o secondario
• Liberare spazio di archiviazione eliminando migliaia di vecchie foto e video
• Svuotare un account condiviso o di prova prima di passarlo ad altri
• Rimuovere grandi blocchi che l'interfaccia web è troppo lenta a selezionare a mano

PRIVACY

• Nessuna richiesta di rete. L'estensione non contatta alcun server, incluso il nostro — non esiste.
• Nessuna analisi, nessuna telemetria, nessuna memoria locale, nessun account.
• Nessun permesso host. Funziona solo su photos.google.com e solo dopo aver cliccato il pulsante.
• Nulla viene raccolto, venduto o trasmesso.

SICUREZZA

• Le eliminazioni vanno nel Cestino, non nel nulla — recuperabili per 30 giorni
• L'estensione si rifiuta di funzionare nel Cestino, perché lì l'eliminazione è definitiva
• Agisce solo sull'account già connesso nella scheda che stai usando

NOTA

Strumento non ufficiale. Non affiliato, approvato o sponsorizzato da Google. "Google Foto" è un marchio di Google LLC, usato solo per descrivere con cosa funziona l'estensione.
```

### Japanese (`ja`)

```
Bulk Delete Google Photos は、Google フォトのライブラリをすばやく空にするための小さなローカルツールです。Google の標準インターフェースでは大量の項目を手作業で選ぶのが現実的でないため、何千枚もの写真や動画をバッチで選択・削除します。

Google フォトには「すべて選択」や「すべて削除」のボタンがなく、何万もの項目をドラッグで選ぶのは遅く、ミスも起きやすいものです。この拡張機能は photos.google.com にサイドパネルを追加し、手作業の操作を自動化します。バッチを選択 → 削除を押す → 確認 → グリッドの再読み込みを待つ → 繰り返し。アカウントを空にしたり、空き容量を確保したりを、一日中クリックせずに行えます。

機能

• バッチによる一括削除：表示中のすべて、または固定バッチサイズを選択。グリッドをスクロールして読み込みを継続
• ドライラン：削除せずに選択してカウント。実行前に動作を確認できます
• 進行状況の表示：削除件数、バッチ番号、フェーズ、経過時間
• 即座に停止する停止ボタン
• 1回の実行あたりの上限（任意）
• 削除前の入力確認（既定でオン）
• アーカイブ表示に対応
• 約 20 のインターフェース言語

主な用途

• 古いアカウントやサブアカウントの写真をすべて削除
• 古い写真や動画を何千枚も削除して Google の空き容量を確保
• 共有・テスト用アカウントを引き渡す前に空にする
• Web UI では手作業で選ぶには遅すぎる大量のバッチを削除

プライバシー

• ネットワーク通信なし。拡張機能はいかなるサーバー（当方を含む）にも接続しません — そもそも存在しません。
• 分析なし、テレメトリなし、ローカル保存なし、アカウントなし。
• ホスト権限なし。photos.google.com でのみ、ツールバーのボタンをクリックした後にのみ動作します。
• 何も収集・販売・送信しません。

安全性

• 削除はゴミ箱へ送られ、完全には消えません — 30 日間は復元可能
• ゴミ箱ページでは削除が永久的になるため、拡張機能は実行を拒否します
• 使用中のタブでログイン済みのアカウントにのみ作用します

注記

これは非公式ツールです。Google との提携・承認・スポンサー関係はありません。「Google フォト」は Google LLC の商標であり、拡張機能の対象を説明するためにのみ使用しています。
```

### Korean (`ko`)

```
Bulk Delete Google Photos는 Google 포토 보관함을 빠르게 비우기 위한 작고 로컬에서 동작하는 도구입니다. Google의 기본 인터페이스로는 수많은 항목을 수동으로 선택하기 어렵기 때문에, 수천 장의 사진과 동영상을 배치로 선택해 삭제합니다.

Google 포토에는 "모두 선택"이나 "모두 삭제" 버튼이 없고, 수만 개 항목을 드래그로 선택하는 것은 느리고 실수가 잦습니다. 이 확장 프로그램은 photos.google.com에 사이드 패널을 추가해 직접 해야 할 클릭을 자동화합니다. 배치 선택 → 삭제 누르기 → 확인 → 그리드 새로고침 대기 → 반복. 하루 종일 클릭하지 않고도 계정을 비우거나 저장용량을 확보할 수 있습니다.

기능

• 배치 단위 일괄 삭제: 보이는 항목 전체 또는 고정 배치 크기를 선택하고, 그리드를 스크롤해 계속 불러옵니다
• 드라이런 모드: 삭제하지 않고 선택·집계만 해 실행 전에 확인
• 실시간 진행 상황: 삭제 수, 배치 번호, 단계, 경과 시간
• 즉시 멈추는 중지 버튼
• 실행당 최대 삭제 수 제한(선택 사항)
• 삭제 전 입력 확인 필수(기본값 켜짐)
• 보관 처리(Archive) 보기 지원
• 약 20개 인터페이스 언어

자주 쓰는 경우

• 예전 계정이나 보조 계정의 사진 전체 삭제
• 오래된 사진·동영상 수천 개를 지워 Google 저장용량 확보
• 공유·테스트 계정을 넘기기 전에 비우기
• 웹 UI로는 수동 선택이 너무 느린 대량 배치 삭제

개인정보 보호

• 네트워크 요청 없음. 확장 프로그램은 어떤 서버에도(당사 포함) 연결하지 않습니다 — 서버 자체가 없습니다.
• 분석 없음, 원격 측정 없음, 로컬 저장 없음, 계정 없음.
• 호스트 권한 없음. photos.google.com에서만, 그리고 도구 모음 버튼을 누른 뒤에만 동작합니다.
• 아무것도 수집·판매·전송하지 않습니다.

안전

• 삭제 항목은 영구 소멸이 아니라 휴지통으로 이동 — 30일간 복구 가능
• 휴지통 페이지에서는 삭제가 영구적이므로 확장 프로그램이 실행을 거부합니다
• 사용 중인 탭에 이미 로그인된 계정에만 작용합니다

참고

비공식 도구입니다. Google과 제휴·보증·후원 관계가 없습니다. "Google 포토"는 Google LLC의 상표이며, 확장 프로그램이 무엇과 함께 동작하는지 설명하기 위해서만 사용합니다.
```

### Russian (`ru`)

```
Bulk Delete Google Photos — небольшой локальный инструмент, чтобы быстро очистить библиотеку Google Фото: он выделяет и удаляет тысячи фото и видео партиями, потому что собственный интерфейс Google делает ручной выбор такого количества непрактичным.

В Google Фото нет кнопок «выбрать всё» или «удалить всё», а выделять десятки тысяч элементов перетаскиванием медленно и чревато ошибками. Это расширение добавляет боковую панель на photos.google.com и автоматизирует те же клики, что вы сделали бы вручную: выбрать партию, нажать «Удалить», подтвердить, дождаться перезагрузки сетки и повторить — чтобы очистить аккаунт или освободить место, не проводя за этим весь день.

ВОЗМОЖНОСТИ

• Массовое удаление партиями: выберите всё видимое или фиксированный размер партии, сетка прокручивается и подгружает ещё
• Пробный прогон: выделяет и считает без удаления, чтобы проверить перед запуском
• Прогресс в реальном времени: число удалённых, номер партии, этап и затраченное время
• Кнопка остановки, срабатывающая мгновенно
• Необязательный лимит на один прогон
• Обязательное подтверждение вводом перед удалением (включено по умолчанию)
• Работает с представлением «Архив»
• Около 20 языков интерфейса

ТИПИЧНЫЕ СЦЕНАРИИ

• Удалить все фото из старого или дополнительного аккаунта
• Освободить место, удалив тысячи старых фото и видео
• Очистить общий или тестовый аккаунт перед передачей
• Удалить крупные партии, которые веб-интерфейс слишком медленно выделяет вручную

КОНФИДЕНЦИАЛЬНОСТЬ

• Никаких сетевых запросов. Расширение не обращается ни к одному серверу, включая наш — его не существует.
• Нет аналитики, телеметрии, локального хранилища и аккаунтов.
• Нет разрешений на сайты. Работает только на photos.google.com и только после нажатия кнопки на панели.
• Ничего не собирается, не продаётся и не передаётся.

БЕЗОПАСНОСТЬ

• Удаления отправляются в Корзину, а не в небытие — восстановимы в течение 30 дней
• Расширение отказывается работать на странице Корзины, потому что там удаление необратимо
• Действует только на аккаунт, уже выполнивший вход во вкладке, которую вы используете

ПРИМЕЧАНИЕ

Неофициальный инструмент. Не связан с Google, не одобрен и не спонсируется Google. «Google Фото» — товарный знак Google LLC, используется только для описания того, с чем работает расширение.
```

### Chinese — Simplified (`zh_CN`)

```
Bulk Delete Google Photos 是一款小巧的本地工具，用于快速清空 Google 相册：批量选择并删除成千上万张照片和视频，因为 Google 自带的界面很难手动选中这么多项目。

Google 相册没有"全选"或"全部删除"按钮，拖动选择数万个项目既慢又容易出错。此扩展在 photos.google.com 上添加一个侧边栏，自动完成你原本要手动执行的点击：选择一批、按删除、确认、等待网格刷新，然后重复——让你无需整天点击即可清空账号或释放存储空间。

功能

• 按批量批删除：选择视图内的全部内容或固定批量大小，并滚动网格持续加载
• 试运行模式：只选择并计数而不删除，便于在执行前验证
• 实时进度：已删除数量、批次编号、阶段和已用时间
• 可立即中止的停止按钮
• 可选的单次运行上限
• 删除前需输入确认（默认开启）
• 支持"归档"视图
• 约 20 种界面语言

常见用途

• 删除旧账号或小号中的所有照片
• 删除数千张旧照片和视频以释放 Google 存储空间
• 在转交前清空共享或测试账号
• 删除网页界面手动选择过慢的大批量内容

隐私

• 无网络请求。扩展不会联系任何服务器，包括我们的——根本不存在。
• 无分析、无遥测、无本地存储、无账号。
• 无主机权限。仅在 photos.google.com 上、且仅在你点击工具栏按钮后运行。
• 不收集、不出售、不传输任何内容。

安全

• 删除内容进入回收站，而非彻底消失——30 天内可恢复
• 扩展拒绝在回收站页面运行，因为那里的删除是永久性的
• 仅作用于你正在使用的标签页中已登录的账号

说明

这是非官方工具，与 Google 无关联，未获 Google 认可或赞助。"Google 相册"是 Google LLC 的商标，仅用于说明本扩展的适用对象。
```

### Hindi (`hi`)

```
Bulk Delete Google Photos एक छोटा, लोकल टूल है जो Google Photos लाइब्रेरी को तेज़ी से खाली करता है: यह हज़ारों फ़ोटो और वीडियो को बैच में चुनकर डिलीट करता है, क्योंकि Google का अपना इंटरफ़ेस इतने सारे आइटम हाथ से चुनना अव्यावहारिक बना देता है।

Google Photos में "सभी चुनें" या "सभी डिलीट करें" बटन नहीं है, और दसियों हज़ार आइटम खींचकर चुनना धीमा और गलती-भरा होता है। यह एक्सटेंशन photos.google.com पर एक साइड पैनल जोड़ता है जो वही क्लिक अपने-आप करता है जो आप खुद करते: एक बैच चुनें, Delete दबाएँ, पुष्टि करें, ग्रिड के रीलोड होने का इंतज़ार करें और दोहराएँ — ताकि आप दिन भर क्लिक किए बिना अकाउंट खाली कर सकें या स्टोरेज खाली कर सकें।

विशेषताएँ

• बैच में बल्क/मास डिलीट: दिख रहा सब कुछ या एक तय बैच आकार चुनें, और ग्रिड स्क्रॉल कर और लोड करता रहे
• ड्राई-रन मोड: डिलीट किए बिना चुनकर गिनती करता है, ताकि आप पहले जाँच सकें
• लाइव प्रगति: डिलीट की गई संख्या, बैच नंबर, चरण और बीता समय
• तुरंत रोकने वाला स्टॉप बटन
• प्रति रन वैकल्पिक अधिकतम सीमा
• डिलीट से पहले टाइप-कर-पुष्टि अनिवार्य (डिफ़ॉल्ट रूप से चालू)
• Archive व्यू के साथ काम करता है
• लगभग 20 इंटरफ़ेस भाषाएँ

सामान्य उपयोग

• किसी पुराने या सेकेंडरी अकाउंट से सभी फ़ोटो डिलीट करना
• हज़ारों पुरानी फ़ोटो और वीडियो हटाकर Google स्टोरेज खाली करना
• साझा या टेस्ट अकाउंट सौंपने से पहले उसे खाली करना
• बड़े बैच हटाना जिन्हें वेब UI हाथ से चुनने में बहुत धीमा है

गोपनीयता

• कोई नेटवर्क अनुरोध नहीं। एक्सटेंशन किसी भी सर्वर से संपर्क नहीं करता, हमारे सहित — वह है ही नहीं।
• कोई एनालिटिक्स नहीं, कोई टेलीमेट्री नहीं, कोई लोकल स्टोरेज नहीं, कोई अकाउंट नहीं।
• कोई होस्ट अनुमति नहीं। यह केवल photos.google.com पर, और केवल टूलबार बटन क्लिक करने के बाद चलता है।
• कुछ भी एकत्र, बेचा या प्रसारित नहीं किया जाता।

सुरक्षा

• डिलीट किए गए आइटम Bin में जाते हैं, हमेशा के लिए नहीं — 30 दिनों तक पुनर्प्राप्त किए जा सकते हैं
• एक्सटेंशन Bin पेज पर चलने से मना करता है, क्योंकि वहाँ डिलीट करना स्थायी होता है
• यह केवल उसी अकाउंट पर काम करता है जो आपके इस्तेमाल किए जा रहे टैब में पहले से साइन-इन है

नोट

यह एक अनौपचारिक टूल है। यह Google से संबद्ध, अनुमोदित या प्रायोजित नहीं है। "Google Photos" Google LLC का ट्रेडमार्क है, जिसका उपयोग केवल यह बताने के लिए किया गया है कि एक्सटेंशन किसके साथ काम करता है।
```

### Dutch (`nl`)

```
Bulk Delete Google Photos is een klein, lokaal hulpmiddel om een Google Foto's-bibliotheek snel leeg te maken: het selecteert en verwijdert duizenden foto's en video's in batches, omdat de interface van Google het onpraktisch maakt om er met de hand zoveel te selecteren.

Google Foto's heeft geen knop "alles selecteren" of "alles verwijderen", en tienduizenden items met slepen selecteren is traag en foutgevoelig. Deze extensie voegt een zijpaneel toe aan photos.google.com dat precies de klikken automatiseert die je anders zelf zou doen: een batch selecteren, op Verwijderen drukken, bevestigen, wachten tot het raster herlaadt, en herhalen — om een account leeg te maken of opslag vrij te maken zonder de hele dag te klikken.

FUNCTIES

• Bulk/massaal verwijderen in batches: selecteer alles wat zichtbaar is of een vaste batchgrootte, en het raster scrollt om meer te laden
• Testrun-modus: selecteert en telt zonder te verwijderen, zodat je het vooraf kunt controleren
• Live voortgang: verwijderde aantallen, batchnummer, fase en verstreken tijd
• Stopknop die onmiddellijk afbreekt
• Optionele bovengrens per run
• Getypte bevestiging vereist vóór verwijderen (standaard aan)
• Werkt met de weergave Archief
• Ongeveer 20 interfacetalen

VEELGEBRUIKTE SCENARIO'S

• Alle foto's van een oud of tweede account verwijderen
• Opslag vrijmaken door duizenden oude foto's en video's te verwijderen
• Een gedeeld of testaccount leegmaken voordat je het doorgeeft
• Grote batches verwijderen die de webinterface te traag met de hand selecteert

PRIVACY

• Geen netwerkverzoeken. De extensie neemt met geen enkele server contact op, ook niet met de onze — die bestaat niet.
• Geen analyse, geen telemetrie, geen lokale opslag, geen accounts.
• Geen host-permissies. Werkt alleen op photos.google.com, en alleen nadat je op de werkbalkknop klikt.
• Er wordt niets verzameld, verkocht of verzonden.

VEILIGHEID

• Verwijderingen gaan naar de Prullenbak, niet het niets — 30 dagen herstelbaar
• De extensie weigert te werken op de Prullenbak-pagina, omdat verwijderen daar definitief is
• Werkt alleen op het account dat al is ingelogd in het tabblad dat je gebruikt

OPMERKING

Dit is een onofficieel hulpmiddel. Het is niet gelieerd aan, goedgekeurd door of gesponsord door Google. "Google Foto's" is een handelsmerk van Google LLC, alleen gebruikt om te beschrijven waarmee de extensie werkt.
```

### Polish (`pl`)

```
Bulk Delete Google Photos to małe, lokalne narzędzie do szybkiego opróżniania biblioteki Google Zdjęć: zaznacza i usuwa partiami tysiące zdjęć i filmów, ponieważ interfejs Google sprawia, że ręczne zaznaczanie tak wielu elementów jest niepraktyczne.

Google Zdjęcia nie mają przycisku „zaznacz wszystko" ani „usuń wszystko", a zaznaczanie dziesiątek tysięcy elementów przeciąganiem jest powolne i podatne na błędy. To rozszerzenie dodaje panel boczny w photos.google.com, który automatyzuje te same kliknięcia, które wykonałbyś ręcznie: zaznacz partię, naciśnij Usuń, potwierdź, poczekaj na przeładowanie siatki i powtórz — aby opróżnić konto lub zwolnić miejsce bez klikania przez cały dzień.

FUNKCJE

• Masowe usuwanie partiami: zaznacz wszystko, co widoczne, lub stały rozmiar partii, a siatka przewija się, by wczytać więcej
• Tryb próbny: zaznacza i liczy bez usuwania, aby sprawdzić przed wykonaniem
• Postęp na żywo: liczba usuniętych, numer partii, etap i czas
• Przycisk stop zatrzymujący natychmiast
• Opcjonalny limit na jedno uruchomienie
• Wymagane potwierdzenie wpisaniem przed usunięciem (domyślnie włączone)
• Działa z widokiem Archiwum
• Około 20 języków interfejsu

TYPOWE ZASTOSOWANIA

• Usunięcie wszystkich zdjęć ze starego lub dodatkowego konta
• Zwolnienie miejsca przez usunięcie tysięcy starych zdjęć i filmów
• Opróżnienie konta współdzielonego lub testowego przed przekazaniem
• Usuwanie dużych partii, które interfejs webowy zbyt wolno zaznacza ręcznie

PRYWATNOŚĆ

• Brak żądań sieciowych. Rozszerzenie nie kontaktuje się z żadnym serwerem, w tym naszym — on nie istnieje.
• Brak analityki, telemetrii, pamięci lokalnej i kont.
• Brak uprawnień do witryn. Działa tylko na photos.google.com i tylko po kliknięciu przycisku.
• Nic nie jest zbierane, sprzedawane ani przesyłane.

BEZPIECZEŃSTWO

• Usunięte elementy trafiają do Kosza, nie w nicość — można je odzyskać przez 30 dni
• Rozszerzenie odmawia działania na stronie Kosza, ponieważ usuwanie jest tam nieodwracalne
• Działa tylko na koncie już zalogowanym na używanej karcie

UWAGA

To narzędzie nieoficjalne. Nie jest powiązane z Google ani przez Google zatwierdzone czy sponsorowane. „Google Zdjęcia" to znak towarowy Google LLC, użyty wyłącznie do opisania, z czym rozszerzenie współpracuje.
```

### Turkish (`tr`)

```
Bulk Delete Google Photos, bir Google Fotoğraflar kitaplığını hızlıca boşaltmak için küçük, yerel bir araçtır: binlerce fotoğraf ve videoyu gruplar halinde seçip siler, çünkü Google'ın kendi arayüzü bu kadar çok öğeyi elle seçmeyi pratik olmaktan çıkarır.

Google Fotoğraflar'da "tümünü seç" ya da "tümünü sil" düğmesi yoktur ve on binlerce öğeyi sürükleyerek seçmek yavaş ve hataya açıktır. Bu uzantı, photos.google.com'a bir yan panel ekleyerek elle yapacağınız tıklamaları otomatikleştirir: bir grup seçin, Sil'e basın, onaylayın, ızgaranın yeniden yüklenmesini bekleyin ve tekrarlayın — böylece bir hesabı gün boyu tıklamadan boşaltabilir veya depolama alanı açabilirsiniz.

ÖZELLİKLER

• Gruplar halinde toplu silme: görünen her şeyi ya da sabit bir grup boyutu seçin, ızgara daha fazlasını yüklemek için kayar
• Deneme modu: silmeden seçip sayar, böylece çalıştırmadan önce doğrulayabilirsiniz
• Canlı ilerleme: silinen sayısı, grup numarası, aşama ve geçen süre
• Hemen durduran durdurma düğmesi
• Çalıştırma başına isteğe bağlı üst sınır
• Silmeden önce yazarak onay gerekir (varsayılan olarak açık)
• Arşiv görünümüyle çalışır
• Yaklaşık 20 arayüz dili

YAYGIN KULLANIMLAR

• Eski veya ikincil bir hesaptaki tüm fotoğrafları silmek
• Binlerce eski fotoğraf ve videoyu silerek depolama alanı açmak
• Paylaşılan veya test hesabını devretmeden önce boşaltmak
• Web arayüzünün elle seçmek için çok yavaş olduğu büyük grupları kaldırmak

GİZLİLİK

• Ağ isteği yok. Uzantı, bizimki dahil hiçbir sunucuyla iletişim kurmaz — zaten yok.
• Analiz yok, telemetri yok, yerel depolama yok, hesap yok.
• Ana makine izni yok. Yalnızca photos.google.com'da ve yalnızca araç çubuğu düğmesine tıkladıktan sonra çalışır.
• Hiçbir şey toplanmaz, satılmaz veya iletilmez.

GÜVENLİK

• Silinenler yok olmaz, Çöp Kutusu'na gider — 30 gün boyunca geri alınabilir
• Uzantı Çöp Kutusu sayfasında çalışmayı reddeder, çünkü orada silme kalıcıdır
• Yalnızca kullandığınız sekmede oturum açmış hesap üzerinde işlem yapar

NOT

Bu resmi olmayan bir araçtır. Google ile bağlantılı, Google tarafından onaylanmış veya desteklenmiş değildir. "Google Fotoğraflar", Google LLC'nin ticari markasıdır ve yalnızca uzantının neyle çalıştığını açıklamak için kullanılır.
```

### Indonesian (`id`)

```
Bulk Delete Google Photos adalah alat kecil yang berjalan secara lokal untuk mengosongkan pustaka Google Foto dengan cepat: memilih dan menghapus ribuan foto dan video secara massal per batch, karena antarmuka Google sendiri membuat pemilihan sebanyak itu secara manual menjadi tidak praktis.

Google Foto tidak punya tombol "pilih semua" atau "hapus semua", dan menyeret untuk memilih puluhan ribu item itu lambat dan rawan kesalahan. Ekstensi ini menambahkan panel samping di photos.google.com yang mengotomatiskan klik yang biasanya Anda lakukan sendiri: pilih satu batch, tekan Hapus, konfirmasi, tunggu grid dimuat ulang, lalu ulangi — sehingga Anda bisa mengosongkan akun atau membebaskan penyimpanan tanpa mengeklik seharian.

FITUR

• Hapus massal per batch: pilih semua yang terlihat atau ukuran batch tetap, dan grid menggulir untuk terus memuat
• Mode uji coba: memilih dan menghitung tanpa menghapus, agar bisa diverifikasi sebelum dijalankan
• Progres langsung: jumlah terhapus, nomor batch, fase, dan waktu berjalan
• Tombol stop yang langsung berhenti
• Batas maksimum opsional per proses
• Konfirmasi ketik wajib sebelum menghapus (aktif secara default)
• Berfungsi dengan tampilan Arsip
• Sekitar 20 bahasa antarmuka

PENGGUNAAN UMUM

• Menghapus semua foto dari akun lama atau akun kedua
• Membebaskan penyimpanan dengan menghapus ribuan foto dan video lama
• Mengosongkan akun bersama atau akun uji sebelum diserahkan
• Menghapus batch besar yang terlalu lambat dipilih manual di antarmuka web

PRIVASI

• Tanpa permintaan jaringan. Ekstensi tidak pernah menghubungi server mana pun, termasuk milik kami — memang tidak ada.
• Tanpa analitik, tanpa telemetri, tanpa penyimpanan lokal, tanpa akun.
• Tanpa izin host. Hanya berjalan di photos.google.com, dan hanya setelah Anda mengeklik tombol toolbar.
• Tidak ada yang dikumpulkan, dijual, atau dikirim.

KEAMANAN

• Penghapusan masuk ke Sampah, bukan lenyap — dapat dipulihkan selama 30 hari
• Ekstensi menolak berjalan di halaman Sampah, karena penghapusan di sana bersifat permanen
• Hanya bekerja pada akun yang sudah login di tab yang Anda gunakan

CATATAN

Ini alat tidak resmi. Tidak berafiliasi, didukung, atau disponsori oleh Google. "Google Foto" adalah merek dagang Google LLC, digunakan hanya untuk menjelaskan ekstensi ini bekerja dengan apa.
```
