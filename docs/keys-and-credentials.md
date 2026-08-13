# 金鑰與憑證清單

本文件集中記錄 LoveGame I 各功能需要的金鑰、識別碼與憑證。文件只描述名稱、用途和設定位置，**不得填入真實私密金鑰或憑證內容**。

## 快速對照

| 功能 | 設定或憑證 | 用戶端可見 | 目前狀態 | 建議設定位置 |
| --- | --- | --- | --- | --- |
| Firebase 初始化 | Firebase Web config（6 個欄位） | 是 | 已使用，現為硬編碼 | Expo public 環境變數 |
| Android Google 登入 | Android OAuth Client ID | 是 | 已使用，現為硬編碼 | Expo public 環境變數 |
| Web Google 登入 | Web OAuth Client ID | 是 | 已使用，現為硬編碼 | Expo public 環境變數 |
| Android Google 登入 | SHA-1 / SHA-256 憑證指紋 | 是，非秘密 | 原生建置與 Google Console 設定時需要 | Firebase / Google Cloud Console |
| Cloud Database（Firestore） | Firebase Web config | 是 | MVP 規劃中；可沿用 Firebase 初始化設定 | Expo public 環境變數 |
| Push Notification | Expo Project ID | 是 | 通知排程已實作；遠端推播尚未接入 | App config / Expo public 環境變數 |
| 後端管理 Firebase | Firebase Admin service account | **否** | Cloud Functions 或管理後端才需要 | Firebase Functions secrets / Google ADC |
| Android 商店簽署 | Android keystore | **否** | 發佈正式版時需要 | EAS Credentials，不進 Git |

## 1. Firebase 初始化

**需要的功能：** Google 登入；未來接入 Firestore 時也會共用。

Firebase Web config 包含：

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

這些值是 Firebase 用戶端設定與專案識別資料，不應被當作伺服器秘密。安全邊界仍須由 Firebase Authentication、Firestore Security Rules、App Check，以及 API key restrictions 建立。

目前使用位置：`src/services/auth/firebaseClient.ts`。目前值直接寫在原始碼中；後續應改由不同環境的 Expo public 環境變數注入，讓 development、staging、production 分別指向不同 Firebase project。

## 2. Google 登入

### Android OAuth Client ID

**需要的功能：** Android App 的 Google 登入。

- 建議變數：`EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- 建立位置：Google Cloud Console / Firebase Authentication
- 目前使用位置：`src/services/auth/useGoogleAuthentication.ts`
- 附帶設定：Android package name 必須與 `app.json` 一致；目前為 `com.lovegame.prototype`。

Android OAuth client 還需要登錄建置憑證的 SHA-1，建議同時登錄 SHA-256。開發版、EAS preview 與 production 若使用不同簽署憑證，必須各自登錄。

### Web OAuth Client ID

**需要的功能：** Web 版 Google popup 登入，以及目前原生 ID token auth request 的 web client audience。

- 建議變數：`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- 建立位置：Google Cloud Console / Firebase Authentication
- 目前使用位置：`src/services/auth/useGoogleAuthentication.ts`
- Web 版需另外維護 Authorized JavaScript origins 與 Authorized redirect URIs。

OAuth Client ID 是公開識別碼，不是 Client Secret。行動 App 不得內嵌 OAuth Client Secret。

## 3. Cloud Database（Firestore）

**需要的功能：** 雲端保存使用者、關係資料、任務進度與遊戲狀態。

React Native 用戶端使用第 1 節的 Firebase Web config，不需要 Firebase Admin 私鑰。資料保護必須依賴登入狀態與 Firestore Security Rules。

目前 repository 尚未接入 Firestore repository，因此現階段沒有額外金鑰。

## 4. Push Notification

### 本機通知

**需要的功能：** 裝置內排程任務提醒。

目前 `ExpoMissionNotificationService` 使用 `expo-notifications` 執行本機排程，不需要 API key。

### 遠端推播

**需要的功能：** 由伺服器主動發送跨裝置通知。

遠端推播尚未實作。接入時預計需要：

- `EXPO_PUBLIC_EAS_PROJECT_ID`：用戶端取得 Expo push token；可公開。
- FCM V1 service account：Android 推播傳送憑證；**只能放在 EAS/Expo 或受管後端的憑證儲存區，不得放進 App、環境變數範例或 Git。**
- Expo Access Token：只有在伺服器啟用 push security 時需要；**僅限後端 secret store。**

## 5. Firebase Admin / Cloud Functions

**需要的功能：** 可信任的伺服器結算、管理資料或由 Cloud Functions 發送推播。

Firebase Admin service account 是高權限私密憑證。部署於 Firebase / Google Cloud 時優先使用執行環境附帶的 service identity 或 Application Default Credentials；若確實需要 JSON key，應存入受管 secret store，禁止：

- 使用 `EXPO_PUBLIC_` 前綴。
- 放入 React Native bundle。
- 提交 service-account JSON、private key 或 refresh token 至 Git。

目前 repository 尚無 `functions/` 實作，因此現階段不需要建立或下載 service-account JSON。

## 6. Android 建置與上架憑證

**需要的功能：** EAS production build、Google Play 上架與更新簽署。

需要 Android keystore、key alias 與密碼。建議全數交由 EAS Credentials 管理。若採本機管理，檔案與密碼必須放在 Git 以外的安全儲存區，且需有可復原的團隊備份。

## 環境變數範本

以下只列名稱，請勿在本文件填值：

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_EAS_PROJECT_ID=
```

`EXPO_PUBLIC_*` 會被編入 App bundle，任何人都能讀取；只能放用戶端公開設定，不能放 service-account key、OAuth Client Secret、keystore 密碼或其他伺服器秘密。

## 環境與輪替原則

- Development、staging、production 使用不同 Firebase projects 與 OAuth clients。
- 公開設定可以提交「變數名稱與空白範本」，私密值只能存於 EAS Secrets 或後端 secret manager。
- 人員異動、疑似外洩或權限範圍變更時，立即撤銷並輪替私密憑證。
- 每季檢查 Google Cloud、Firebase、EAS 的擁有者、憑證與未使用 OAuth clients。
- 禁止在 issue、聊天截圖、測試 fixture、log 或 crash report 中貼出 token 與私鑰。

## 目前專案注意事項

`firebaseClient.ts` 與 `useGoogleAuthentication.ts` 目前含有 Firebase client config 與 OAuth Client ID。它們不是伺服器私鑰，但仍建議移至環境變數，以支援環境隔離與限制誤用。若任何真正的私密憑證曾提交到 repository，僅從 Git 刪除並不足夠，仍必須到原服務撤銷及輪替。
