# LoveGame I

Android-first 戀愛生存遊戲 MVP。核心循環：

> 現實重要事件 → 提醒 → 生存任務 → 結算 → EXP / Combo / Rank → 收藏 → 下一個事件

目前 repository 僅包含已確認的產品、遊戲規則與實作架構文件；尚未建立 Expo 專案或撰寫應用程式程式碼。

## 文件索引

- [架構設計](docs/architecture.md)
- [遊戲規則 v0.2](docs/game-rules-v0.2.md)
- [資料模型與 Firestore schema](docs/data-model.md)
- [MVP 開發計畫與驗收標準](docs/implementation-plan.md)
- [金鑰與憑證清單](docs/keys-and-credentials.md)

## 已確認決策

- Android first：React Native + Expo + TypeScript。
- Google Login、Cloud Database、Push Notification 都是 MVP 範圍。
- 任務結果由 server time 與存檔時區判定；UI 不可自行計算遊戲規則。
- Rank Score 範圍為 -10 至 +10；降到 -10 進入可復活的 GG 狀態。
- 重要日期可由模板預設或玩家自行指定為 survival / normal。
- EXP 實際數值尚未定義，必須在 Progression 實作階段前確認。
