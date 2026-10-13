# 画像生成の記録

生成日：2026-10-13

依頼書：`docs/images.md`（リポジトリの b6751600888a7b06ce9403f4c2fa47ff6b72281b を参照）。

使用ツール：OpenAI / Codex 組み込み image_gen。各画像を個別に生成。特定の作品・作者・俳優の参照は使用していない。

出力は sRGB、背景を含む RGB。WebP は画質75〜80、SNS用のみ JPEG。指定サイズに縮小し、比率の微差は中央から調整。高解像度PNGはリポジトリに含めない。

## img/title.webp

ツール：Codex image_gen ／ 1440×960 ／ 232,792 bytes ／ 画質 80

編集入力：今回生成した同じ画像の初稿。構図・持ち物・描き込み・背景を上記依頼に合わせて調整。外部の画像は使っていない。

プロンプト：

```text
Use case: style-transfer
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Edit the supplied title panorama. Preserve the same Gifu landscape subjects and their arrangement: Nagara River, castle mountain in foreground, plains, distant snowy mountains, exactly four plain colored streamers. Simplify ONLY the rendering: modern flat Japanese editorial illustration with clean bold even outlines, large flat unbroken color areas, clearly simplified clusters of trees and buildings, much less tiny detail. Washi texture must be extremely faint and smooth, almost invisible, without grain or speckled noise. No engraving hatching. The goal is an attractive clean game illustration readable at phone sizes. Foreground bottom 15% should be mostly simple river or land shapes. Castle and four streamers within central 70% width. Landscape 3:2, opaque background, no text or emblems.
```

## img/ogp.jpg

ツール：Codex image_gen ／ 1200×630 ／ 196,008 bytes ／ 画質 77

参照：今回生成した `img/title.webp` を風景と画風の参考として使用し、横長に再構成。

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Social sharing artwork, wide landscape approximately 1.9:1, recomposition of the Gifu title landscape. A sunny morning bird's eye panorama, foreground Nagara River and wooded castle mountain evoking Mount Kinka, middle Nobi plain, small towns and fields with several rivers, distant snow capped Hida mountains. Four plain wind streamers vermilion, indigo, moss green and purple in the sky, all focal subjects within central 70%. No title lettering; reserve calm negative space for text added separately later. No prominent people.
Use supplied final title landscape as reference. Recompose the same scene into approximately 1.9:1 horizontal landscape. Preserve four colored plain streamers, castle mountain, river, plains and distant snowy mountains. Use the reference's simplified modern flat rendering: broad flat colors, moderate dark outlines, simplified tree clusters and small buildings, extremely faint smooth paper texture with no speckled grain, minimal fine detail. Do not stretch the original. No text or crests.
```

## img/adv/dosan.webp

ツール：Codex image_gen ／ 512×512 ／ 25,766 bytes ／ 画質 80

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
An elderly Sengoku daimyo Saito Dosan with completely shaved monk-like head, shrewd yet kindly humorous eyes. Simple monk-like robe. Holds a small ceramic oil jar recalling his youthful oil-selling.
Square portrait, chest-up, body slightly turned, face looking at viewer. Face center at 42% of height. Keep head, small handheld prop and shoulders inside a generous central circular safe area, head has margin. Plain off-white washi background with only very faint cloud shapes. Calm confident expression. Simplified flat shapes, not elaborate hatching; clean coherent character design. No other people.
```

## img/adv/nobunaga.webp

ツール：Codex image_gen ／ 512×512 ／ 26,210 bytes ／ 画質 80

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Oda Nobunaga, a confident daimyo in his thirties with a thin moustache, kosode and kataginu samurai formal clothing. Holds a small folding fan, no crest.
Square portrait, chest-up, body slightly turned, face looking at viewer. Face center at 42% of height. Keep head, small handheld prop and shoulders inside a generous central circular safe area, head has margin. Plain off-white washi background with only very faint cloud shapes. Calm confident expression. Simplified flat shapes, not elaborate hatching; clean coherent character design. No other people.
```

## img/adv/hanbei.webp

ツール：Codex image_gen ／ 512×512 ／ 26,268 bytes ／ 画質 80

参照：今回生成した `img/adv/nobunaga.webp` を画風・配色・構図の参考として使用。人物の顔・衣装・持ち物は別に指定。

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Takenaka Hanbei, young slim fair-skinned strategist, calm intelligent expression, jinbaori sleeveless surcoat. Holds a small rolled scroll.
Square 1:1 chest-up portrait, body slightly turned and face toward viewer. Face center exactly at x50%, y42%. Entire head must have generous margin, uppermost hair or head at y15% or below. Small prop held high in front of chest at y68%, within x30%-70%; all head and prop fully inside a centered circular crop. Plain off-white washi background with faint cloud pattern. Calm confident expression. Match the provided reference's outline weight, flat shading, palette and background treatment; it is a style reference only, draw a different distinct person and the specified outfit/prop. Single person only, no text or crests.
```

## img/adv/mitsuhide.webp

ツール：Codex image_gen ／ 512×512 ／ 28,300 bytes ／ 画質 80

参照：今回生成した `img/adv/nobunaga.webp` を画風・配色・構図の参考として使用。人物の顔・衣装・持ち物は別に指定。

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Akechi Mitsuhide, a samurai commander in his forties, composed handsome face, meticulously neat clothing. Holds a brush and small closed notebook.
Square 1:1 chest-up portrait, body slightly turned and face toward viewer. Face center exactly at x50%, y42%. Entire head must have generous margin, uppermost hair or head at y15% or below. Small prop held high in front of chest at y68%, within x30%-70%; all head and prop fully inside a centered circular crop. Plain off-white washi background with faint cloud pattern. Calm confident expression. Match the provided reference's outline weight, flat shading, palette and background treatment; it is a style reference only, draw a different distinct person and the specified outfit/prop. Single person only, no text or crests.
```

## img/adv/nagachika.webp

ツール：Codex image_gen ／ 512×512 ／ 29,752 bytes ／ 画質 76

参照：今回生成した `img/adv/nobunaga.webp` を画風・配色・構図の参考として使用。人物の顔・衣装・持ち物は別に指定。

編集入力：今回生成した同じ画像の初稿。構図・持ち物・描き込み・背景を上記依頼に合わせて調整。外部の画像は使っていない。

プロンプト：

```text
Use case: style-transfer
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Original subject: Kanamori Nagachika, elderly samurai commander who developed Takayama. Holds an unfolded small town planning diagram with line-only map and no text.
Edit the supplied illustration to simplify fine detail and texture substantially. Keep the elderly samurai, his face and town-plan prop. Make the town-plan simpler with fewer, broader clean lines and no tiny markings. Keep original clothing colors.
Smooth flat solid color areas and clean even-weight dark outlines. No grain, speckles, canvas texture, hatching or painterly shading; paper feel only from warm off-white and subtle cloud shapes. Preserve composition, scene content, dignified mood and palette. Square chest-up portrait, full opaque washi background without circular frame. No text, lettering, crests, logos or watermark.
```

## img/adv/basho.webp

ツール：Codex image_gen ／ 512×512 ／ 29,040 bytes ／ 画質 80

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Matsuo Basho, gentle middle-aged traveling poet in travel clothes and hood, small walking staff, woven straw traveling hat visible behind shoulder.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% of image height; generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, fill entire square with background, do not draw any circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, minimal soft paper texture, no photo-realism or tiny engraving hatch marks. Original newly invented face, single subject.
```

## img/adv/oribe.webp

ツール：Codex image_gen ／ 512×512 ／ 29,798 bytes ／ 画質 75

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Furuta Oribe, bearded tea-master samurai with a subtle playful smile, holding a small asymmetrical ceramic tea bowl with green glaze, general Oribe ware characteristics.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% of image height; generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, fill entire square with background, do not draw any circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, minimal soft paper texture, no photo-realism or tiny engraving hatch marks. Original newly invented face, single subject.
```

## img/adv/toson.webp

ツール：Codex image_gen ／ 512×512 ／ 23,838 bytes ／ 画質 80

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Shimazaki Toson, Meiji-to-Showa novelist and poet in kimono and haori, short hair and moustache, holding a small closed book. Original newly designed face and pose; no recreation of any existing photograph.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% of image height; generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, fill entire square with background, do not draw any circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, minimal soft paper texture, no photo-realism or tiny engraving hatch marks. Original newly invented face, single subject.
```

## img/adv/enku.webp

ツール：Codex image_gen ／ 512×512 ／ 29,368 bytes ／ 画質 77

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Enku, traveling Buddhist monk in simple robe, sun-tanned face. Holds a small rustic carved wooden Buddhist figure and a compact wood carving hatchet, dignified kindly expression.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% height with generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, full square background, no circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, very subtle smooth paper texture, no photo realism or tiny engraving hatch marks. Original newly invented face, single subject.
```

## img/adv/chiune.webp

ツール：Codex image_gen ／ 512×512 ／ 26,568 bytes ／ 画質 80

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Chiune Sugihara, Japanese diplomat circa 1940 in suit and tie, sincere kind expression, holds fountain pen and blank papers with no writing. Original newly designed face and pose, no recreation of any existing photograph.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% height with generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, full square background, no circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, very subtle smooth paper texture, no photo realism or tiny engraving hatch marks. Original newly invented face, single subject.
```

## img/adv/chiyo.webp

ツール：Codex image_gen ／ 512×512 ／ 29,664 bytes ／ 画質 78

編集入力：今回生成した同じ画像の初稿。構図・持ち物・描き込み・背景を上記依頼に合わせて調整。外部の画像は使っていない。

プロンプト：

```text
Use case: precise-object-edit
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Original subject: Chiyo, wife of Yamauchi Kazutoyo, a Sengoku samurai woman in kosode and uchikake, intelligent calm expression, period appropriate tied hair. Holds a small wooden mirror box recalling her wise household savings.
Simplify ONLY the kimono's decorative patterns and paper texture. Replace the elaborate flower print with mainly plain flat vermilion, purple and indigo fabric and just a few understated simple decorative lines. Make paper texture extremely faint and smooth, no grain. Keep the same woman's face, hair, expression, pose, hands and mirror box; retain original palette and dark outlines.
Square opaque portrait, no text, crests or watermark.
```

## img/adv/ieyasu.webp

ツール：Codex image_gen ／ 512×512 ／ 29,652 bytes ／ 画質 76

編集入力：今回生成した同じ画像の初稿。構図・持ち物・描き込み・背景を上記依頼に合わせて調整。外部の画像は使っていない。

プロンプト：

```text
Use case: precise-object-edit
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Original scene: Tokugawa Ieyasu, stout mature daimyo in Japanese gusoku armor, composed expression. Holds a small saihai command baton. No crest.
Keep Ieyasu's face, hair, armor, pose and paper-strip saihai exactly as they are. Change ONLY background: replace the mottled washi and many cloud shapes with an almost plain smooth warm off-white (#efe6d2) background and just two extremely faint small cloud shapes. No grain or texture.
Square chest-up portrait. Opaque background. No text, emblems or watermarks.
```

## img/adv/mitsunari.webp

ツール：Codex image_gen ／ 512×512 ／ 29,630 bytes ／ 画質 76

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Ishida Mitsunari, slim-faced intellectual samurai with a focused expression, holds a small wooden abacus in front of chest.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% height, generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, full square background, no circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, extremely subtle smooth paper texture, no photo realism or tiny engraving hatch marks. Original newly invented face, single subject. Plain clothing and armor without emblems, logos or crests.
```

## img/adv/yoshitsugu.webp

ツール：Codex image_gen ／ 512×512 ／ 29,900 bytes ／ 画質 77

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Subject: Otani Yoshitsugu, samurai with white cloth hood that covers head and lower half of face, leaving only eyes visible. Gentle faithful gaze, holds small prayer beads. Respectful representation, do not emphasize illness.
Square 1:1 chest-up portrait, body slightly turned, face looking at viewer. Face center at 42% height, generous margin above entire head. All main features in central 70%, small prop held high in front of chest. Plain off-white washi background with faint cloud shapes, full square background, no circular frame. Calm confident expression. Clean flat character illustration with consistent moderately thick dark outlines, simplified fabric shapes, extremely subtle smooth paper texture, no photo realism or tiny engraving hatch marks. Original newly invented face, single subject. Plain clothing and armor without emblems, logos or crests.
```

## img/event/takayama.webp

ツール：Codex image_gen ／ 1200×400 ／ 53,418 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: A splendid Japanese festival float with mechanical karakuri dolls proceeds along an old Takayama street of wooden townhouses with latticed doors. Small-faced spectators. No cherry blossoms or autumn leaves, usable in both spring and autumn.
One central festival float with a small mechanical doll visible, elegant red and gold decoration rendered as simple large panels. Only two simplified townhouses on each side and about six tiny spectators. Entire float, including roof ornament, fits with a visible top margin. Quiet plain street and sky occupying half the image.
IMPORTANT: Minimalist Japanese flat game banner, not elaborate landscape art. Exactly 3:1 horizontal. Very simple modern illustrated shapes, moderate even dark outlines, entirely smooth plain color fills. No grain or paper fibers, no shading texture, no hatching, no dither, no fine surface detail. Washi quality comes from palette alone. Main subject central 60%, quiet edges. No text, signs, emblems or watermark.
```

## img/event/ukai.webp

ツール：Codex image_gen ／ 1200×400 ／ 57,168 bytes ／ 画質 80

編集入力：今回生成した同じ画像の初稿。構図・持ち物・描き込み・背景を上記依頼に合わせて調整。外部の画像は使っていない。

プロンプト：

```text
Use case: style-transfer
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Original scene: Nagara River at night. A traditional wooden cormorant fishing boat with a bright burning brazier. A cormorant master wearing an eboshi cap and straw waist skirt manages tethered cormorants with ropes. Small castle silhouette atop distant mountain, fire reflected in river.
Redraw the supplied scene as a MUCH SIMPLER modern Japanese flat illustration for a small mobile game banner. Keep the festival/river/dancing subject and central composition, but remove 70% of incidental detail. Smooth broad solid color areas, bold even outlines. No grain, no speckles, no canvas texture, no painterly shading, no hatching: washi feel comes only from warm off-white and subtle cloud shapes. Simplify buildings to large silhouettes and a few lattice lines; simplify water to 3-5 broad ribbons; trees to large flat clumps. People as a small group with simple clothing and small faces; no intricate fabric patterns. Main subject central 60%, quiet side margins. Still polished and dignified, not a rough sketch. Exactly 3:1 horizontal banner, no letters, text, logos or crests.
```

## img/event/gujo.webp

ツール：Codex image_gen ／ 1200×400 ／ 38,912 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: Summer night in a Japanese castle-town street, people in yukata dancing together in a circle, lanterns under eaves. Group scene with small indistinct faces. Joyful warm night.
A small circle of six yukata dancers with small indistinct faces centered in the composition. Lanterns under two simple townhouse eaves at edges. No platform, no huge castle, no crowd, no printed fabric patterns. Half the picture is quiet sky and plain street.
IMPORTANT: Minimalist Japanese flat game banner, not elaborate landscape art. Exactly 3:1 horizontal. Very simple modern illustrated shapes, moderate even dark outlines, entirely smooth plain color fills. No grain or paper fibers, no shading texture, no hatching, no dither, no fine surface detail. Washi quality comes from palette alone. Main subject central 60%, quiet edges. No text, signs, emblems or watermark.
```

## img/event/rain.webp

ツール：Codex image_gen ／ 1200×400 ／ 58,186 bytes ／ 画質 78

編集入力：今回生成した同じ画像の初稿。構図・持ち物・描き込み・背景を上記依頼に合わせて調整。外部の画像は使っていない。

プロンプト：

```text
Use case: precise-object-edit
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Original scene: Rainy riverside, swollen river contained by embankment. Volunteer firefighters in raincoats stacking sandbags, residents watching safely nearby. Sense of preparedness and mild tension, no injured people, destroyed houses or people in the water.
Keep the firefighters, sandbag action, safely contained river and composition. Simplify ONLY incidental fine detail: grassy banks become broad flat green fields, stone embankment has only a few large stones, river foam becomes 3 broad simple flowing lines, rain has only a few faint spaced strokes. Smooth plain colors, no grain, speckles or surface textures. Keep all important content and original palette.
3:1 landscape banner. Opaque background. No text, emblems or watermarks.
```

## img/event/snow.webp

ツール：Codex image_gen ／ 1200×400 ／ 36,428 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: Snowy mountain town in Hida, winter sun breaking through. Snowplow clearing a road, residents safely removing snow from roofs. Quiet supportive community; no disaster or injuries.
One central red snowplow and two small residents clearing snow near two simple mountain-town houses. One resident safely shovels a roof. Snow and sky together cover more than half the image as smooth nearly unbroken shapes. Mountains are simple broad blue layers, just a few grouped conifers. No dense detailed village or forest.
IMPORTANT: Minimalist Japanese flat game banner, not elaborate landscape art. Exactly 3:1 horizontal. Very simple modern illustrated shapes, moderate even dark outlines, entirely smooth plain color fills. No grain or paper fibers, no shading texture, no hatching, no dither, no fine surface detail. Washi quality comes from palette alone. Main subject central 60%, quiet edges. No text, signs, emblems or watermark.
```

## img/event/seki.webp

ツール：Codex image_gen ／ 1200×400 ／ 27,202 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: Morning mist over the fields of Sekigahara. Distant camp curtains and plain unmarked tall nobori banners, mountains behind. No people, no crests or flag emblems.
Only a few plain vertical banners and two simple camp curtain shapes in the middle distance. No foreground plants, rocks or tree details. A wide empty field, two simple mountain silhouettes and broad flat mist bands fill most of the picture.
Modern minimal flat Japanese illustration, clean vector-like forms painted as a raster illustration. Limit visual complexity severely: large smooth flat color fields, simple bold outlines, no textured shading, paper fibers, grain, speckles, tiny strokes or intricate details. Exactly 3:1 horizontal banner. Main subjects central 60%. Warm off-white paper tone and faint simple cloud shapes provide washi feel. No text, logos, family crests or watermark.
```

## img/event/firm.webp

ツール：Codex image_gen ／ 1200×400 ／ 37,750 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: A new modern factory being constructed on leveled land against Japanese mountain backdrop. Crane and trucks. Generic original factory, no real corporation, no logos or lettering.
Create a simple, restrained modern Japanese flat graphic illustration. Very limited detail, about 20 large shapes and clean uniform dark outlines, broad SOLID color fills. No grain, speckles, canvas, brush texture or tiny decoration. Washi feel only from off-white color, a barely perceptible smooth paper tone. Architecture simple silhouettes with only a few window lines, mountains simple layered silhouettes. Exactly 3:1 horizontal banner, subjects central 60% and side margins quiet. Include only objects necessary for the described scene. Small simple people if required, no elaborate faces. No letters, text, emblems, crests or watermark.
```

## img/event/vote.webp

ツール：Codex image_gen ／ 1200×400 ／ 56,932 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: A bright welcoming local Japanese community hall polling station. Residents of varied ages waiting in a line and placing folded ballots into a plain ballot box. Faces small, cheerful dignified atmosphere, no election posters or any text.
Create a simple, restrained modern Japanese flat graphic illustration. Very limited detail, about 20 large shapes and clean uniform dark outlines, broad SOLID color fills. No grain, speckles, canvas, brush texture or tiny decoration. Washi feel only from off-white color, a barely perceptible smooth paper tone. Architecture simple silhouettes with only a few window lines, mountains simple layered silhouettes. Exactly 3:1 horizontal banner, subjects central 60% and side margins quiet. Include only objects necessary for the described scene. Small simple people if required, no elaborate faces. No letters, text, emblems, crests or watermark.
```

## img/end/unify.webp

ツール：Codex image_gen ／ 1200×800 ／ 78,420 bytes ／ 画質 76

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
A radiant aerial view of Gifu at dawn. Three broad layers of snow-capped blue mountains in the distance, broad quiet green and tan plains, and ONE broad winding river connecting north to south. ONE large plain vermilion wind streamer fluttering in the upper central sky, fully within central 70% width with a margin from edges. A few tiny roof silhouettes suggest towns. The river and streamer dominate.
Landscape 3:2. Strictly only landscape: NO people, animals, castles or added objects. Very simple clean flat editorial illustration with even dark indigo outlines, broad solid colors and generous quiet sky and land. No grain, speckles, paper fibers, brush texture or hatching. Do not draw dense villages, individual leaves, detailed fields or numerous rivers. The washi feel is a smooth warm off-white tone. Primary subjects centered in 70% width. No letters, text, emblems or watermark.
```

## img/end/region.webp

ツール：Codex image_gen ／ 1200×800 ／ 77,448 bytes ／ 画質 76

プロンプト：

```text
Use case: stylized-concept
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
View from a spring hill across a winding river and a small peaceful town. One cherry tree with simple pink blossom clusters frames the scene; roof silhouettes only, no detailed buildings. Three soft blue mountain silhouettes continue beyond the horizon. A warm hopeful sense of regional achievement and further journey ahead.
Landscape 3:2. Strictly only landscape: NO people, animals, castles or added objects. Very simple clean flat editorial illustration with even dark indigo outlines, broad solid colors and generous quiet sky and land. No grain, speckles, paper fibers, brush texture or hatching. Do not draw dense villages, individual leaves, detailed fields or numerous rivers. The washi feel is a smooth warm off-white tone. Primary subjects centered in 70% width. No letters, text, emblems or watermark.
```

## img/end/term.webp

ツール：Codex image_gen ／ 1200×800 ／ 63,248 bytes ／ 画質 80

プロンプト：

```text
Use case: illustration-story
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients, subtle washi paper texture. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified. Original artwork. Not photorealistic. No text, no letters, no logos, no signatures, no watermarks. No family crests or emblems, flags and banners plain. Do not imitate existing artworks, characters, actors or photographic compositions. Opaque fully illustrated background.
Scene: A municipal office at dusk. Through window warm lights of the town, on desk a stack of blank papers and a small Japanese tea cup. Peaceful atmosphere of gratitude after a term of hard work, not too lonely. No people, no text. Central 70% focal composition.
A simple office still life. One desk, one stack of blank papers and one small tea cup; a single rectangular window with simple dark town roof silhouettes and a few warm glowing windows outside. Broad plain walls and desk surface, minimal details. Cozy dusk mood.
Modern minimal flat Japanese illustration, clean vector-like forms painted as a raster illustration. Limit visual complexity severely: large smooth flat color fields, simple bold outlines, no textured shading, paper fibers, grain, speckles, tiny strokes or intricate details. Exactly 3:2 landscape. Main subjects central 70%. Warm off-white paper tone and faint simple cloud shapes provide washi feel. No text, logos, family crests or watermark.
```


## 架空人材の追加画像（2026-10-13）
使用ツール：Codex組み込み image_gen。指示書：`docs/images.md` の4-5。各人物を個別に生成。PNG原稿はCodexの生成画像フォルダに保持し、納品は256×256、RGB/sRGB、WebP画質75〜80、各8KB以内。一部は容量上限に合わせて縮小フィルタを使用。

### img/staff/21201-0.webp
金華 城子（岐阜市）／256×256／7,796 bytes／画質 80

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。きりっとした課長。紺のジャケットに、小さな城の形のピンバッジ
```

### img/staff/21201-1.webp
鵜飼 長良（岐阜市）／256×256／7,988 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・50代。日焼けした川の男。法被風の上着で、肩に鵜が1羽とまっている
```

### img/staff/21202-0.webp
水野 枡美（大垣市）／256×256／7,852 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。明るい笑顔。木の枡を両手で持つ
```

### img/staff/21202-1.webp
清水 湧（大垣市）／256×256／7,802 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。さわやか。水色のシャツ、手に水のしずく形のガラス瓶
```

### img/staff/21203-0.webp
飛騨 匠（高山市）／256×256／7,906 bytes／画質 79

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・60代。木工職人。作務衣に頭の手ぬぐい、鉋（かんな）を持つ
```

### img/staff/21203-1.webp
宮川 朝子（高山市）／256×256／7,964 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。朝市の店主。エプロン姿で、野菜の入ったかごを抱える
```

### img/staff/21204-0.webp
暑井 夏樹（多治見市）／256×256／7,938 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。暑さに負けない元気者。半袖シャツ、首にタオル、うちわ
```

### img/staff/21204-1.webp
笠原 彩（多治見市）／256×256／7,992 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。カラフルなモザイクタイル柄のスカーフ
```

### img/staff/21205-0.webp
兼元 研（関市）／256×256／7,828 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。刃物の研ぎ師。前掛け姿で、砥石を持つ（刃物は描かない）
```

### img/staff/21205-1.webp
根道 萌音（関市）／256×256／7,988 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。絵を描くのが好き。ベレー帽と絵筆、そばに睡蓮の花
```

### img/staff/21206-0.webp
馬籠 坂子（中津川市）／256×256／7,788 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・50代。宿場町の案内人。着物に前掛け、文字のない提灯
```

### img/staff/21206-1.webp
栗山 きん（中津川市）／256×256／7,912 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・70代。和菓子屋のおばあちゃん。栗きんとんを載せた皿を持ち、にこにこ
```

### img/staff/21207-0.webp
卯建 紙子（美濃市）／256×256／7,776 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。和紙職人。白い作業着で、すいた和紙を広げる
```

### img/staff/21208-0.webp
土岐 源（瑞浪市）／256×256／7,906 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・60代。化石好き。作業帽とルーペ、アンモナイトの化石を持つ
```

### img/staff/21209-0.webp
羽島 ひかり（羽島市）／256×256／7,958 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。明るいスーツ姿。白い流線形の列車の模型（実在の車両に似せない）
```

### img/staff/21209-1.webp
竹鼻 藤乃（羽島市）／256×256／7,756 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。藤色のカーディガン、藤の花房を持つ
```

### img/staff/21210-0.webp
岩村 艶（恵那市）／256×256／7,778 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。城下町の女城主のような凛とした雰囲気。和装に扇
```

### img/staff/21211-0.webp
坪内 逍（美濃加茂市）／256×256／7,842 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・50代。文学好き。丸眼鏡に本を抱える
```

### img/staff/21211-1.webp
蜂屋 柿之介（美濃加茂市）／256×256／7,892 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。農家。作業着で、干し柿を持つ
```

### img/staff/21212-0.webp
下石 徳利（土岐市）／256×256／7,778 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・60代。陶工。あごひげ、焼き物の徳利を持つ
```

### img/staff/21212-1.webp
窯元 志野（土岐市）／256×256／7,910 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。陶芸家。作務衣に、白くやわらかな志野焼の茶碗
```

### img/staff/21213-0.webp
空野 翔（各務原市）／256×256／8,000 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。フライトジャケット風の上着、紙飛行機を持つ
```

### img/staff/21213-1.webp
境川 桜（各務原市）／256×256／7,870 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。桜色のカーディガン、桜の枝を持つ
```

### img/staff/21214-0.webp
兼山 湊（可児市）／256×256／7,860 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。川港の船頭。はっぴに、櫂（かい）を持つ
```

### img/staff/21214-1.webp
森 蘭（可児市）／256×256／7,860 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。きびきびした新人。胸に蘭の花のブローチ
```

### img/staff/21215-0.webp
伊自良 柿乃（山県市）／256×256／7,908 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・50代。干し柿を連ねたすだれを持つ
```

### img/staff/21216-0.webp
富有 実（瑞穂市）／256×256／7,904 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。柿農家。大きな富有柿を手にのせる
```

### img/staff/21216-1.webp
美江 宿（瑞穂市）／256×256／7,764 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。宿の女将。和装で、文字のない提灯
```

### img/staff/21217-0.webp
古川 起（飛騨市）／256×256／7,804 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。祭りの太鼓打ち。さらしに法被、ばちを持つ
```

### img/staff/21218-0.webp
根尾 淡墨（本巣市）／256×256／7,890 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・60代。上品。淡い墨色の着物、淡い桜の枝
```

### img/staff/21219-0.webp
八幡 踊（郡上市）／256×256／7,892 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。浴衣にうちわ、踊り出しそうな笑顔
```

### img/staff/21220-0.webp
湯之島 泉（下呂市）／256×256／7,960 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。温泉宿の人。浴衣に羽織、肩に手ぬぐい、湯気
```

### img/staff/21221-0.webp
平田 靱乃（海津市）／256×256／7,980 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。治水の技術者。作業ジャケットに、堤防の図面（文字なし）
```

### img/staff/21302-0.webp
根木 葱太（岐南町）／256×256／7,986 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。農家。作業着で、ねぎの束を担ぐ
```

### img/staff/21303-0.webp
小栗 駿（笠松町）／256×256／7,970 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。乗馬の好きな若者。乗馬用のベスト、蹄鉄を持つ
```

### img/staff/21341-0.webp
滝口 孝（養老町）／256×256／7,926 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・70代。穏やかなおじいさん。ひょうたんを持つ
```

### img/staff/21361-0.webp
南宮 垂水（垂井町）／256×256／7,898 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・50代。祭りの世話役。法被姿で、湧き水をくむ柄杓
```

### img/staff/21362-0.webp
不破 関太（関ケ原町）／256×256／7,824 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。古戦場の案内人。陣羽織風のベスト（家紋なし）、無地の小さなのぼり
```

### img/staff/21381-0.webp
日吉 ばら奈（神戸町）／256×256／7,896 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。バラの花束を抱える
```

### img/staff/21382-0.webp
輪中 堤（輪之内町）／256×256／7,880 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・50代。水防団。法被にスコップ、頼もしい
```

### img/staff/21383-0.webp
結城 縁（安八町）／256×256／7,864 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。和装に、色とりどりの組紐
```

### img/staff/21401-0.webp
谷汲 巡（揖斐川町）／256×256／7,954 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・60代。巡礼の旅人。菅笠と白い上着、杖
```

### img/staff/21403-0.webp
柿野 薔子（大野町）／256×256／7,914 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。片手に柿、胸にバラ
```

### img/staff/21404-0.webp
池田 霞（池田町）／256×256／7,976 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。茶摘みの手ぬぐい、茶葉のかご
```

### img/staff/21421-0.webp
安藤 守（北方町）／256×256／7,938 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。まじめな防災担当。防災ヘルメットと作業服
```

### img/staff/21501-0.webp
坂口 祝（坂祝町）／256×256／7,894 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。お祝い好き。紅白の扇子を広げ、大きな笑顔
```

### img/staff/21502-0.webp
半布 里子（富加町）／256×256／7,798 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・50代。郷土史家。眼鏡に古文書の巻物
```

### img/staff/21503-0.webp
舟木 漕（川辺町）／256×256／7,884 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。ボート選手。ライフジャケットに、オール
```

### img/staff/21504-0.webp
上麻生 礫（七宗町）／256×256／7,802 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・60代。地質学者。ハンマーと丸い石
```

### img/staff/21505-0.webp
丸山 湖（八百津町）／256×256／7,914 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。アウトドアジャケット、湖のような青い色の服
```

### img/staff/21506-0.webp
檜山 茶々（白川町）／256×256／7,910 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。エプロン姿で湯のみを持つ。そばに檜の小枝
```

### img/staff/21507-0.webp
槌乃 小太郎（東白川村）／256×256／7,986 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。幻の生きもの「つちのこ」の探検家。探検帽に虫あみ
```

### img/staff/21521-0.webp
中山 道子（御嵩町）／256×256／7,980 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。街道歩きの旅人。笠と文字のない地図
```

### img/staff/21604-0.webp
荻町 結（白川村）／256×256／7,930 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。綿入れの半纏、茅の束を抱える
```

### img/staff/ext-hokkaido.webp
十勝 牧（北海道）／256×256／7,918 bytes／画質 79

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。酪農家。オーバーオールに牛乳瓶
```

### img/staff/ext-aomori.webp
津軽 林檎（青森県）／256×256／7,782 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。赤いりんごを持つ、ほっぺが赤い
```

### img/staff/ext-miyagi.webp
伊達 政子（宮城県）／256×256／7,722 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。おしゃれなキャリア女性。三日月形の髪飾り（眼帯・兜は描かない）
```

### img/staff/ext-akita.webp
比内 小町（秋田県）／256×256／7,788 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。きりたんぽを持つ、色白
```

### img/staff/ext-yamagata.webp
佐藤 錦（山形県）／256×256／7,962 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。さくらんぼの耳飾り
```

### img/staff/ext-ibaraki.webp
水戸 納（茨城県）／256×256／7,822 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。納豆の器と箸
```

### img/staff/ext-tochigi.webp
宇都宮 餃太（栃木県）／256×256／7,834 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。コック帽、ぎょうざの皿
```

編集入力：今回生成した同じ人物の初稿。外部画像は使用していない。

修正プロンプト：

```text
Use case: precise-object-edit. Edit this original fictional modern male chef game portrait. Keep his exact face, age, hair, expression, clothing, hands, gyoza plate, colors and pale gray-blue background. Change ONLY his tall chef hat: make it a compact short white chef toque entirely visible with the highest point at 8% of canvas height and generous margin from top edge. Keep face position unchanged. Smooth simple flat colors and consistent dark outlines. Square chest-up portrait, no text, logos, crests or watermark.
```

### img/staff/ext-gunma.webp
上州 空風（群馬県）／256×256／7,854 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。風になびく髪、赤いだるまを抱える
```

### img/staff/ext-tokyo.webp
江戸川 粋（東京都）／256×256／7,834 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。粋な江戸っ子。法被に、ねじり鉢巻
```

### img/staff/ext-niigata.webp
越後 米蔵（新潟県）／256×256／7,866 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・50代。米農家。米俵を担ぐ
```

### img/staff/ext-toyama.webp
黒部 鱒子（富山県）／256×256／7,902 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。丸い曲げわっぱの、ますのすし
```

### img/staff/ext-ishikawa.webp
金沢 箔子（石川県）／256×256／7,950 bytes／画質 79

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。上品。金箔のきらめくアクセサリー
```

### img/staff/ext-fukui.webp
鯖江 鏡子（福井県）／256×256／7,752 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。おしゃれな眼鏡
```

### img/staff/ext-nagano.webp
信濃 蕎麦子（長野県）／256×256／7,892 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・50代。そば打ち。手ぬぐいに麺棒
```

### img/staff/ext-shizuoka.webp
駿河 富士子（静岡県）／256×256／7,970 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。湯のみの緑茶、富士山柄の手ぬぐい
```

### img/staff/ext-aichi.webp
味噌川 赤音（愛知県）／256×256／7,914 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。元気。赤味噌の小さな樽
```

### img/staff/ext-mie.webp
鈴鹿 走（三重県）／256×256／7,774 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。レーシングスーツ風の服（ロゴなし）、ヘルメットを抱える
```

### img/staff/ext-shiga.webp
琵琶 湖太郎（滋賀県）／256×256／7,924 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。釣り帽にライフジャケット
```

### img/staff/ext-kyoto.webp
祇園 雅（京都府）／256×256／7,998 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・30代。上品な和装に扇（舞妓の扮装にはしない）
```

編集入力：今回生成した同じ人物の初稿。外部画像は使用していない。

修正プロンプト：

```text
Use case: precise-object-edit. Edit this original fictional woman in her 30s wearing a modern-day kimono, holding a folding fan. Keep exact face, friendly calm expression, kimono, fan, hands, colors and pale gray-blue background. Change ONLY hair styling and ornaments: replace elaborate ceremonial updo and dangling floral ornaments with a simple neat contemporary low bun with NO hair ornaments. She is an ordinary local woman, not a maiko, geisha or performer. All hair fits with clear top margin. Clean simple flat colors and dark outlines. No text, logos, crests or watermarks.
```

### img/staff/ext-osaka.webp
浪速 商人（大阪府）／256×256／7,792 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・50代。人なつこい商売人。そろばんを持つ
```

### img/staff/ext-hyogo.webp
明石 焼太（兵庫県）／256×256／7,882 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。明石焼き（玉子焼）の板
```

### img/staff/ext-nara.webp
春日 鹿之助（奈良県）／256×256／7,958 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。鹿せんべいを持つ
```

### img/staff/ext-hiroshima.webp
宮島 紅葉（広島県）／256×256／7,754 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。もみじ柄の服、もみじ形のおまんじゅう
```

### img/staff/ext-kagawa.webp
讃岐 麺太（香川県）／256×256／7,868 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。うどん職人。ねじり鉢巻に、うどんの器
```

### img/staff/ext-ehime.webp
伊予 柑太（愛媛県）／256×256／7,944 bytes／画質 78

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・20代。みかん色の服、柑橘を持つ
```

### img/staff/ext-kochi.webp
坂本 竜真（高知県）／256×256／7,730 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。波柄のシャツ、カツオの一本釣りの竿（羽織・袴・懐手など坂本龍馬の定番の姿にしない）
```

編集入力：今回生成した同じ人物の初稿。外部画像は使用していない。

修正プロンプト：

```text
Use case: precise-object-edit. Edit this original fictional Japanese man in his 30s, wearing a modern wave-pattern shirt and holding a bonito pole-fishing rod. Keep his exact face, hairstyle, smile, posture, rod and pale gray-blue background. REMOVE the large fish and the hand holding it; his free arm rests naturally below the chest. Simplify ONLY the shirt pattern to THREE large broad abstract wave bands in indigo and white, without numerous repeating small waves or dots. The required features are wave shirt and fishing rod. Keep the face large and readable, chest-up square icon composition. Smooth flat colors, even dark outlines, minimal detail. No grain, speckles, logos, text, crests or watermarks.
```

### img/staff/ext-fukuoka.webp
博多 明太（福岡県）／256×256／7,832 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・40代。屋台の大将。明太子の皿
```

### img/staff/ext-kumamoto.webp
肥後 熊太（熊本県）／256×256／7,760 bytes／画質 76

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 男性・30代。大柄で温かい。いきなり団子を持つ（熊のキャラクターは描かない）
```

### img/staff/ext-kagoshima.webp
西郷 隆子（鹿児島県）／256×256／7,874 bytes／画質 75

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・40代。さつまいもを抱える（犬を連れた西郷隆盛像に似せない）
```

### img/staff/ext-okinawa.webp
琉球 美海（沖縄県）／256×256／7,998 bytes／画質 77

プロンプト：

```text
Use case: stylized-concept
Asset type: original fictional modern Japanese local government / community game character portrait.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight dark indigo outlines (#1b2830), simple flat solid color fills, minimal shading. Palette: off-white, vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b). Bright, friendly, slightly playful, dignified. Match the existing Gifu game illustration series. Very simple readable silhouette and broad color areas for a tiny 44px icon. No grain, speckles, hatching, fine decoration or realistic skin texture.
Square 1:1 chest-up portrait, almost frontal, one person only. Large face centered x50%, y42%, face width about 40% of canvas; top of hair/headwear has a clear margin. Important head and a compact prop in central circular safe area. Prop held high near the chest, not hiding face. Background entirely opaque uniform pale gray-blue (#e2e9ed); NO clouds, circle frame, border or scenic backdrop.
Contemporary fictional original person, never resemble real politicians, actors, historic portraits, mascots or existing characters. Clothing and haircut should fit modern community members. No text, letters, numbers, logos, signatures, watermarks, crests or emblems. No extra props beyond the subject specification.
Subject specification (Japanese): 女性・20代。かりゆしウェア、海の青
```


## img/event/elect.webp

生成日：2026-10-13

ツール：Codex組み込み image_gen ／1200×400 ／55,114 bytes ／画質 80 ／RGB・sRGB・背景あり

参照：今回のシリーズ用に生成した `img/event/vote.webp` を画風・線・配色の参考として使用。選挙の場面は新たに生成した。特定の実在人物・作品・写真は参照していない。

プロンプト：

```text
Use case: illustration-story
Asset type: Gifu Toitsu Senki game event banner, election scene.
Input image: style reference ONLY, matching existing series outline weight, limited colors and simple rendering; create a completely new scene.
Flat modern Japanese illustration with a woodblock-print feel: clean even-weight outlines in dark indigo (#1b2830), flat color fills, minimal gradients. Limited palette: off-white washi (#efe6d2), vermilion (#cf4526), indigo (#2c5fa3), moss green (#5b8a24), purple (#874c9b), muted greens and slate blue for land. Bright, warm, slightly playful, dignified, approachable civic atmosphere. Original artwork. Not photorealistic.
Scene: a modern Japanese station-front plaza in a small town. A plain compact election campaign van is parked in the middle. ONE fictional adult candidate stands on its flat rooftop platform delivering a speech through a microphone, shown from behind or as a distant tiny face with no recognizable identity. SIX residents of varied ages stand listening, viewed at a modest distance. TWO plain unmarked vertical nobori banners near the vehicle. A simple generic small station building behind, without any signs or words, and subtle distant Gifu mountain silhouettes.
Exactly 3:1 very wide horizontal composition. All of the main van, rooftop candidate, listeners and banners must fit in the central 60% width (x20%-80%); the outer 20% at each side is quiet broad plaza, sky and simple building silhouette. Keep the van wheels and entire candidate in frame; no cropped heads. Large simple flat shapes, small indistinct faces, minimal architectural detail and only a few large clothing folds. Restrained modern editorial illustration consistent with the reference.
Smooth SOLID color areas; paper feeling from warm off-white palette only. No grain, speckles, surface texture, painterly shading, dense crowd, hatching or tiny detail.
The van and banners are entirely blank. No text, letters, numbers, names, license plate text, political party names, logos, seals, crests, election posters, slogans, signatures or watermarks. No real politician likeness. Entire background is opaque.
```

編集入力：今回生成した同じ選挙画像の前稿。

修正プロンプト：

```text
Use case: precise-object-edit
Correct the staging and candidate hand anatomy in this original election banner.
CRITICAL spatial relationship: the candidate must FACE and SPEAK TO all six listeners. Use a clear camera view from BEHIND the audience, looking toward the rooftop candidate. The candidate stands centered on the campaign van roof, turned toward the foreground audience, shown FRONTALLY or a slight frontal three-quarter view. His face is tiny and generic with minimal indistinct features, not a recognizable real person. He looks downward at the listening residents. His mouth and microphone point toward them.
Reposition all SIX residents in the foreground in a shallow arc, with their BACKS or rear three-quarter views toward the camera and their heads directed UP toward the candidate. All are on the SAME audience-facing side of the van; nobody is listening from behind the candidate. Leave a gap in the center to keep the van visible. Preserve the varied resident ages and existing clothing colors. This must read unmistakably as speaker facing audience, with audience facing speaker.
Hands: the candidate holds ONE microphone naturally in one hand. His other hand makes a small relaxed open gesture toward the audience, with four fingers grouped closely and one separate thumb, anatomically plausible wrist, connected sleeve, no jagged claw/starburst, extra digits, detached fingers or twisted wrist. Avoid fine finger detail. Residents' arms may rest naturally at their sides, with simple readable hand shapes.
Preserve the existing flat Japanese illustration style, dark even-weight outlines, warm palette, plain white campaign van, TWO unmarked nobori banners, generic small station building, mountains, trees, bright daytime mood, and opaque background. Preserve the approximately 3:1 wide format. Keep candidate, van, audience and banners within central 60% width, all heads and feet inside frame. Simplify incidental fine detail. Do not add people or objects.
No text, lettering, names, party logos, signs, emblems, signatures or watermarks. No real politician likeness.
```

編集入力：今回生成した同じ選挙画像の前稿。

修正プロンプト：

```text
Use case: precise-object-edit
Correct ONLY the tiny face of the rooftop speaker in this supplied election illustration. The currently blank skin-colored face needs simple natural human facial features: TWO small dark eyes and subtle brows, one minimal nose mark, and a small speaking mouth partly near the microphone. Friendly composed expression. Keep the face small and stylized, with original fictional features and no real politician likeness.
Preserve the current front-facing head orientation toward the six listeners, exact head size and location, hairstyle, all candidate hands and arm gestures, microphone, suit and sash. Preserve the complete corrected staging: speaker facing foreground listeners, all six listeners seen from behind facing the speaker. Preserve EVERY other pixel-level composition element, including van, blank banners, station, mountains, trees, palette, outline style, opaque background and wide 3:1 framing. Do not add text, lettering, logos, people, objects or fine realistic detail.
```
