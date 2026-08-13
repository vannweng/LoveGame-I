# LoveGame I

Android-first 戀愛生存遊戲 MVP。核心循環：

> 現實重要事件 → 提醒 → 生存任務 → 結算 → EXP / Combo / Rank → 收藏 → 下一個事件

目前包含 Expo 原型、像素風設計系統、可計算的關係／任務規則，以及開發用 Scenario。

## 本機開發

```bash
npm run web
```

請保持終端機持續執行，然後開啟 Expo 顯示的網址（通常為 `http://localhost:8081`）。開發模式可在登入頁選擇「DEV 預覽模式」，進入後以右下方的 `DEV` 選單切換 Seed Data／Scenario。

目前所有 Feature Flag 預設開啟。若要在 Production 暫時關閉行動中心，請以環境變數啟動：

```bash
EXPO_PUBLIC_FEATURE_ACTION_HUB=false npm run web
```

## 文件索引

- [架構設計](docs/architecture.md)
- [遊戲規則 v0.2](docs/game-rules-v0.2.md)
- [16-Bit 像素風設計系統](docs/design-system.md)
- [資料模型與 Firestore schema](docs/data-model.md)
- [MVP 開發計畫與驗收標準](docs/implementation-plan.md)
- [金鑰與憑證清單](docs/keys-and-credentials.md)
- [MVP Analytics 事件與漏斗](docs/analytics.md)
- [未來開發路線圖](docs/future-roadmap.md)
- [Firestore Security Rules 與 Emulator 測試](docs/firestore-security.md)

## 已確認決策

- Android first：React Native + Expo + TypeScript。
- Google Login、Cloud Database、Push Notification 都是 MVP 範圍。
- 任務結果由 server time 與存檔時區判定；UI 不可自行計算遊戲規則。
- Rank Score 範圍為 -10 至 +10；降到 -10 進入可復活的 GG 狀態。
- 重要日期可由模板預設或玩家自行指定為 survival / normal。
- EXP 實際數值尚未定義，必須在 Progression 實作階段前確認。
