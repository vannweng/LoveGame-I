# Cloud Functions 部署指南

目前有兩個 Callable Functions：`createMission`、`resolveMission`。

## 專案別名

| Alias | Project ID | 用途 |
| --- | --- | --- |
| `default` | `demo-lovegame-i` | 本機 Firestore Emulator 測試；不會連線雲端 |
| `dev` | `lovegame-i-dev` | App 目前 Firebase config 對應的開發環境 |

`dev` 的 project ID 是依現有 App Firebase config 對齊；在 Firebase CLI 登入並確認有該專案權限前，禁止執行部署。

## 一次性前置條件

1. 以專案擁有者帳號執行 `npx firebase login`。
2. 執行 `npx firebase projects:list`，確認能看到 `lovegame-i-dev`。
3. 在 Firebase Console 對 `lovegame-i-dev` 啟用 Cloud Functions 所需的 Blaze 方案。
4. 確認 Firebase 專案中的 Android App package 是 `com.lovegame.prototype`；Google 登入需要同時核對 Android SHA-1／SHA-256。
5. JDK 21 必須可用，才能執行 Firestore Emulator 測試。

## 部署前驗證

```bash
npm --prefix functions run lint
npm run typecheck
npm run lint
npm test
npm run test:mission-resolution
npm run test:firestore-rules
```

## 部署至 dev

```bash
npm run deploy:functions:dev
```

此命令只部署 `createMission` 與 `resolveMission`，不會部署其他 Function。部署後在 Firebase Console 確認 region、Node.js 22 runtime 與 callable endpoint；再接入 UI。

## 部署後不可省略

- 在 Firebase Console 啟用 App Check 的監控模式，確認合法 App requests 後再切換 enforcement。
- 以已登入帳號實測：建立生日任務、重複建立、提前結算、成功／Late／Fail 結算。
- 驗證 Analytics DebugView：只在新任務建立時有一次 `mission_create`，且不含姓名、日期、任務內容或位置。
- 在 Production 另建 project alias；不得將 dev project 直接當 Production 使用。
