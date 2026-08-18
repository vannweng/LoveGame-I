# 戀愛生存 App｜Game Design Context

> 本文件定義遊戲世界觀、核心循環、名詞與長期規則方向。具體數值與已上線行為仍以最新明確 Task、版本化規則文件及 Content Config 為準。

## 世界觀與語氣

玩家不是在清待辦，而是在「戀愛關係中努力活下去」。App 的角色像一位嘴很壞、但真心想救玩家的 NPC 求生教練。

語氣定位：

```text
毒舌 × 幽默 × 遊戲 NPC × 戀愛求生教練
```

可以使用嘴砲、自嘲、誇張、黑色幽默，以及 GG、墳墓、復活、重新做人、生還、Boss、危機等 RPG／生存遊戲用語。

文案邊界：

- 可以笑玩家，但不能讓玩家覺得被教訓。
- 不真正羞辱或做人身攻擊。
- 不貶低特定性別，不把關係描述成控制或服從。
- 不扮演心理諮商，也不寫成企業生產力工具。
- Domain 命名採 `player`、`partner`、`relationship` 等中性詞；特定世界觀只存在於 Content／UI。

示例：

```text
女友生日剩 5 天。現在開始還有救。
```

```text
今天沒有任務。很好，至少今天不會分手。
```

```text
Mission Failed
勇者。真的很勇。
```

## Core Gameplay Loop

```text
現實事件
→ Trigger / Notification
→ Home
→ Mission
→ 玩家決策與現實行動
→ Mission Resolution
→ Success / Late / Fail
→ Reward / Consequence
→ 更新 EXP / Combo / Rank
→ Collection / Record
→ Next Hook
```

## Rank／Survival Status

Rank 代表玩家「目前」的戀愛生存狀態，不是只升不降的永久 Level。

- 範圍：`-10` 至 `+10`，共 21 階。
- 初始值：`0`。
- 任務成功或失敗可以使 Rank 上升或下降。
- 顯示名稱屬 Content Layer，規則不得依名稱字串判斷。

暫定 21 階身分：

| Rank | 身分 |
| ---: | --- |
| +10 | 戀愛之神 |
| +9 | 戀愛傳奇 |
| +8 | 完美伴侶 |
| +7 | 神隊友 |
| +6 | 求婚候選人 |
| +5 | 模範男友 |
| +4 | 可靠男友 |
| +3 | 暖男 |
| +2 | 貼心男友 |
| +1 | 生還者 |
| 0 | 普通人 |
| -1 | 勇者 |
| -2 | 努力求生 |
| -3 | 戀愛菜鳥 |
| -4 | 求生中 |
| -5 | 工具人 |
| -6 | 危險人物 |
| -7 | 危機邊緣 |
| -8 | 已讀不回 |
| -9 | 封鎖候選 |
| -10 | 🪦 GG |

建議內容資料以 `rankId`、`rankValue`、`titleKey`、`descriptionKey`、`assetKey` 表達。以上名稱仍可調整，不可成為 Business Logic。

## Mission 與結果

基礎結果：

```ts
success | late | fail
```

未來可擴充 `perfect`、`criticalFail`、`expired`、`skipped`。不同結果可影響 EXP、Rank、Combo、Reward、Collection 與 Statistics。

長期任務類型可包含：

```text
normal
important
boss
anniversary
daily
relationship
gift
date
emergency
specialEvent
```

每種 Mission 可有自己的 reward、penalty、deadline、priority、collection 與 ending。不得假設所有任務成功和失敗都有相同數值。

### Boss Mission

生日、周年、情人節、求婚或重要約會可在未來成為 Boss Mission，具有較高 Reward／Penalty、稀有收藏、特殊 Ending 或專屬 UI。Boss 系統不是必須一次完成的 MVP 功能，但架構不應阻止日後加入。

## EXP、Rank 與 Combo

三者意義不同：

- EXP：長期累積經驗，原則上不因失敗歸零。
- Rank：目前生存狀態，可以上升或下降。
- Combo：連續成功處理生存事件的紀錄。

任務數值必須由 Reward／Rule／Content Config 取得，例如 `mission.reward.exp`；UI 只顯示結果，不能自行 `exp + 10`。

Combo 未來可在 7、30、100、365 等節點觸發 Badge、Title、Collection、Bonus EXP、Rare Reward 或特殊動畫。具體門檻與獎勵仍由版本化規則決定。

## GG、Rebirth 與 Run

Rank 到 `-10` 時進入 GG。GG 不是永久 Game Over，而是一輪戀愛生存紀錄結束。

世界觀上的 Restart 稱為「立下誓言／重新做人」：

```text
你已經 GG。
是否願意重新做一個好人？

[我願意]
```

每次從 Rank 0 開始、直到 GG，可視為一輪 Survival Run。每輪可記錄生存天數、最高 Rank、成功／失敗數、死因與誓言。

重生只能重設 Current Run，不得重設 Player Account。以下永久保留：

- 死亡與輪迴次數
- 歷史最高 Rank 與最長存活時間
- 歷史誓言
- 已解鎖收藏與 Achievements
- Lifetime EXP

Rebirth 後的 Rank 固定恢復為 `-5`，Combo 歸零，EXP、收藏與歷史保留。MVP 的 Revival Mission 是「立下誓言」：誓言不可留白，不設失敗期限或額外懲罰；完成即開始下一輪 Run。下一次 GG 時，系統會顯示上一輪誓言並以毒舌文案提醒玩家「你上次說過這句，結果又 GG 了」。

## Collection Philosophy

收藏的目的不是堆圖示，而是保存玩家自己的戀愛生存歷史。成功、失敗與黑歷史都可以成為故事，讓失敗也帶來新的內容，而不是只有懲罰。

### 收藏類型

- Identity Collection：永久記錄曾到達的 21 階 Rank。
- Title：可展示的特殊稱號，不等於 Rank。
- Achievement / Badge：首次完成、Combo、Mission 數、GG、Rebirth 等永久成就。
- Run History：每一輪的生存天數、最高 Rank、成敗、死因與誓言。
- Ending：不同死因、Good／Rare／Secret Ending。
- Relic：由 Mission、Ending、重要日、活動、Rebirth 或成就產生的戀愛遺物。
- Relationship Memory：第一次約會、旅行、送花、生日、100 天、跨年等真實回憶。
- 黑歷史 Collection：失聯、最後一刻訂位、連敗等幽默收藏，但不能人格羞辱。

範例稱號與收藏包含：七日生還者、不死鳥、生日救火隊、Boss Killer、重新做人、枯萎的花、壞掉的蛋糕、未讀訊息、電影票與不同死亡 Ending。

### Current State 與 Permanent Progress

| Current State（可變動） | Permanent Progress（永久） |
| --- | --- |
| Current Rank | Unlocked Rank |
| Combo | Title / Badge |
| Current Run | Ending / Relic / Memory |
| Current Mission State | Run History / Lifetime Stats |

兩類資料不能混在一起。收藏可抽象為 `CollectionItem`，包含 `id`、`type`、文案與素材 key、rarity、unlock condition、secret 狀態；具體 Schema 僅在任務要求時建立。

## Retention 與長期玩法

核心留存循環是：

```text
現實事件
→ Mission
→ Gameplay
→ Status Change
→ Collection Unlock
→ Progress / History
→ 下一個現實事件
```

未來可加入季節限定 Mission／Badge／Relic／Title／Ending、稀有與秘密收藏、角色外觀、雙人 Mission 與個人化任務。這些都是擴充方向，不是本文件授權的開發範圍。

## Data-driven 規則

以下內容應由 versioned Content Config 管理：

- Mission Reward 與 Penalty
- Rank Definition
- Collection Definition 與 Unlock Condition
- Copy 與 Asset key

同一個已生成 Mission 應保存規則快照，避免之後調整 Content Config 改變歷史結果。

## 規則狀態與來源

本文件保存長期設計意圖；精確的 Mission 日期、結算時點、目前獎勵數值與已核准的日常／週末玩法，應以最新 Task、`docs/game-rules-v0.2.md` 及 `src/content/` 的相符版本為準。若三者不一致，先提出衝突，不猜測或靜默改規則。
