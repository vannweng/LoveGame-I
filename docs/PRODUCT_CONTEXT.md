# 戀愛生存 App｜Product Context

> 本文件說明產品是什麼、為誰解決什麼問題，以及功能優先順序。
> 它是長期背景，不是一次性開發需求，也不代表其中所有 Roadmap 項目已獲准實作。

## 一句話定義

**一款把經營感情變成 RPG 生存遊戲的戀愛管理 App；玩家完成現實中的戀愛任務維持生存狀態，失敗會掉 Rank、甚至 GG，但成功、失敗、死亡與重生都會留下永久收藏與人生紀錄。**

核心組合是：

```text
戀愛管理工具 × 生存遊戲 × 收集遊戲
```

它不是單純的 To-do App、紀念日 App、情侶 App 或 Habit Tracker。真正差異在於：

```text
現實事件 + 遊戲結果 + 角色狀態 + 收藏 + 歷史
```

## 使用者與核心需求

MVP 以「一位玩家管理一段關係」為核心。玩家需要記住或處理伴侶生日、紀念日、約會、禮物、送花、行程與喜好等現實事件，但不想使用一個冰冷的工作管理工具。

產品要幫玩家：

- 提前看見重要事件，知道下一步可以做什麼。
- 把容易拖延的關係行動變成短而可玩的 Mission。
- 從完成、延遲與失敗中得到清楚回饋。
- 看見當前生存狀態，也保留長期累積的故事。
- 用幽默降低壓力，而不是評判誰是不是「好伴侶」。

未來可支援伴侶加入與共同遊玩，但 Couple Mode 不是 MVP 前提，資料與流程不應為此過早複雜化。

## Product Fantasy

玩家打開 App 時的心理應是：

> 今天又有生存任務了。

而不是：

> 我又多了一件待辦事項。

核心 Fantasy 是「努力在戀愛關係中活下去」。遊戲用誇張、毒舌、自嘲的方式增加趣味，不嚴肅裁定玩家或伴侶的好壞。

## 核心產品體驗

```text
現實戀愛事件
→ 提醒或觸發
→ 首頁看見狀態
→ 進入任務
→ 採取現實行動
→ 成功／遲到／失敗
→ 獎勵或後果
→ EXP／Combo／Rank 改變
→ 解鎖收藏並留下紀錄
→ 等待下一個事件
```

主要留存問題不是「通知有沒有送到」，而是：

- 我現在還活著嗎？
- 我的故事累積到哪裡？
- 我還缺哪些收藏？

## 主要產品系統

目前產品概念包含：

- Home：顯示目前生存狀態、近期事件與下一步。
- Mission：接收、執行及結算現實任務。
- Relationship Information：關係開始日、伴侶資料、重要日與偏好。
- Anniversary / Calendar：把重要日期轉成可提前準備的事件。
- Collection：保存身分、成就、結局、遺物、回憶與輪迴歷史。
- Profile / Settings：帳號、關係資料與通知等設定。
- Guide / Recommendation、Gift、Date：屬可延伸的產品系統，不因出現在本文就自動進入 MVP。

## 雙軸成長與情緒設計

產品必須同時提供兩種進度：

| 進度 | 內容 | 玩家感受 |
| --- | --- | --- |
| 垂直進度 | Rank、EXP、Combo | 我變強了／目前活得如何 |
| 水平進度 | Collection、Ending、Title、Memory、Run History | 我的故事越來越完整 |

垂直進度可以因失敗下降，產生生存張力；水平進度應盡量永久保留，避免一次失敗抹除玩家的所有成就感。

## MVP 優先順序

第一階段先建立可玩的完整 Loop：

1. Mission
2. Mission Result
3. EXP
4. Rank
5. Combo
6. 基本 Reward Feedback
7. Collection Unlock
8. GG
9. Rebirth
10. Run History

第二階段可深化 Title、Badge、Ending、Relic 與 Collection Gallery。

第三階段才考慮季節活動、稀有收藏、角色外觀、個人化任務、推薦與 Couple Mode。未經明確 Task 核准，不實作這些 Roadmap 項目。

## 長期擴充方向

- 更多收藏：稱號、徽章、遺物、結局、回憶、秘密與季節收藏。
- 季節事件：情人節、七夕、聖誕、跨年、生日季、周年活動。
- 稀有度與秘密解鎖：Common、Rare、Epic、Legendary、Secret。
- 角色表現：外觀、服裝、墓碑、背景、頭像框；不得讓遊戲規則依賴素材。
- Couple Mode：共享事件、雙人任務、共同收藏與互相派任務。
- Personalized Mission：未來可依重要日、喜好與歷史產生任務。
- Recommendation：餐廳、禮物、約會、行程與危機處理建議可轉成 Mission。

依目前專案範圍，AI 推薦、餐廳搜尋、行事曆同步、地圖／定位及相關整合均不是可自行擴充的 MVP 功能，必須另行取得明確核准。

## 產品原則

- 先完成可玩的 Gameplay Loop，再增加內容深度。
- 新功能必須強化現實事件、遊戲結果、狀態、收藏或歷史之間的連結。
- 失敗仍應產生故事或收藏，降低挫折後棄用的機率。
- 通知只是入口，不是產品本身，也不是遊戲資料的真相。
- 不因長期 Roadmap 而一次開發所有系統。

## 關鍵字

```text
Relationship Survival
Reality-driven Gameplay
Mission
Survival Status
EXP
Rank
Combo
Reward
Penalty
Collection
Achievement
Ending
GG
Rebirth
Run
Permanent Progress
Game State
```

## 文件使用方式

若內容衝突，採以下優先順序：

```text
最新明確 Task
> AGENTS.md 與已核准規格
> 現有程式實際架構與行為
> 本文件的長期產品背景
```

小功能修改只完成 Task 本身。若現況會明顯阻礙未來方向，先指出問題並提出最小調整，不自行大規模重構。
