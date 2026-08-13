# LoveGame I — 16-Bit 像素風設計系統與 UI/UX 指南

本文件是 LoveGame I 全站的 **16-Bit 復古像素電玩（Pixel Art Arcade）**設計系統規範。包含核心色票、字型階層、間距與圓角、標準組件契約及開發檢查清單，供團隊與 AI 開發者快速查閱。

## 1. 設計核心原則

1. **硬核像素邊框（Border-Only Card Architecture）**
   - 卡片背景 `cardBg` 必須與頁面背景 `pageBg` 完全相同；禁止用實心底色製造浮起效果。
   - 模組以 1–2px 銳利邊框區分；標準為 `borderWidth: 2` 與 `borderColor`。
   - 圓角維持直角或像素微方角，使用 `borderRadius: 2–4`。
2. **像素字型貫穿（16-Bit Pixel Typography）**
   - 英文、數字與 HUD 使用 `PressStart2P_400Regular` 或 `PixelifySans_700Bold`。
   - 中文標題與內文使用 `DotGothic16_400Regular`。
   - 全站字級經 `fs(size)` 與 `FONT_SCALE = 1.15` 進行縮放。
3. **電玩化 HUD 語言（Retro Arcade Language）**
   - 介面採用 `[P1/P2]`、`[HP: 85/100]`、`[STAGE 520 DAYS]`、`[QUEST]`、`[VAULT]`、`[SOS]` 等遊戲語彙。
4. **簡短有力標題（Short Title Constraint）**
   - 標題以 2–4 字為主，最多 6 字，例如「檔案設定」、「年度預算」、「約會足跡」。

## 2. 核心 16-Bit 像素色票

### 2.1 基礎色票

| Token (`PIXEL_PALETTE`) | HEX | 用途 |
| --- | --- | --- |
| `DEEP_SPACE` | `#0D0E15` | 暗色頁面與卡片底色、高對比暗色外框 |
| `FAMICOM_CREAM` | `#F5F2EB` | 亮色頁面與卡片底色、暗色版主文字 |
| `ARCADE_CYAN` | `#00E5FF` | 品牌主色、主按鈕、Active 導覽與重點圖示 |
| `COIN_GOLD` | `#FFD700` | 金幣庫、VIP、五星與高勝率指標 |
| `SOLAR_ORANGE` | `#FF6D00` | 連勝天數、倒數高亮與 STAGE 標籤 |
| `WARNING_RED` | `#FF1744` | SOS 警報、地雷標籤與低 HP |
| `ROMANTIC_PINK` | `#FF4081` | 紀念日倒數、心動指數與伴侶標籤 |
| `HP_GREEN` | `#00E676` | 安全狀態與任務完成 |
| `ARCADE_VIOLET` | `#B388FF` | 特殊成就與進階設定 |

### 2.2 語意化主題色票

透過 `useTheme()` 取得 theme 物件；實作時須以語意 token 取代元件內寫死的 HEX。

```ts
theme.pageBg           // Dark: #0D0E15; Light: #F5F2EB
theme.cardBg           // 必須與 pageBg 相同
theme.subBoxBg         // Dark: #161726; Light: #E8E2D5
theme.borderColor      // Dark: #363753; Light: #C8BFAD
theme.textPrimary      // Dark: #F5F2EB; Light: #0D0E15
theme.textSecondary    // Dark: #9D9BB5; Light: #6B687E
theme.primary          // #00E5FF
theme.accentOrange     // #FF6D00
theme.accentEmergency  // Dark: #FF1744; Light: #D50000
theme.pixelGold        // #FFD700
theme.pixelGreen       // #00E676
theme.pixelPink        // #FF4081
theme.pixelBorderWidth // 2
```

## 3. 字型與版面 Token

### 3.1 字型定義

```ts
import { PIXEL_FONTS, fs } from '../services/themeService';

PIXEL_FONTS.NUMBER  // PressStart2P_400Regular：數字、英文標籤、HUD
PIXEL_FONTS.DISPLAY // PixelifySans_700Bold：大型展示標題
PIXEL_FONTS.BODY    // DotGothic16_400Regular：中文標題、內文、按鈕
```

### 3.1.1 字型載入與 fallback

App 使用 `@expo-google-fonts/dotgothic16` 與 `expo-font` 載入 `DotGothic16_400Regular`。載入期間顯示系統讀取畫面；若字型載入失敗，或字型缺少個別繁體中文字形，系統會使用裝置的等寬字型 fallback 繼續顯示：iOS 為 `Menlo`，Android／Web 為 `monospace`。

因此字型載入失敗不會阻擋使用者登入或操作。不得將字型載入失敗視為致命錯誤，也不得要求使用者自行安裝字型。

### 3.2 字階尺寸

```ts
TYPOGRAPHY.HERO          // 22px：Header 產品名、大數字
TYPOGRAPHY.SECTION_TITLE // fs(14) = 16px：卡片主標題
TYPOGRAPHY.CARD_TITLE    // fs(12) = 14px：卡片次標題／中型按鈕
TYPOGRAPHY.BODY          // fs(12) = 14px：標準內文／L 按鈕文字
TYPOGRAPHY.CAPTION       // fs(10) = 12px：輔助說明／M 按鈕文字
TYPOGRAPHY.TAG           // fs(10) = 12px：狀態標籤／徽章
TYPOGRAPHY.MICRO         // fs(10) = 12px：HUD、英文副標籤
```

### 3.3 間距與圓角

```ts
SPACING.XS  // 4px
SPACING.SM  // 8px
SPACING.MD  // 12px
SPACING.LG  // 16px
SPACING.XL  // 20px
SPACING.XXL // 24px

PIXEL_RADIUS.NONE // 0px
PIXEL_RADIUS.XS   // 2px：按鈕、Tag、輸入框
PIXEL_RADIUS.SM   // 4px：卡片、Modal 容器
PIXEL_RADIUS.MD   // 8px：特殊視圖外框
```

## 4. 標準 UI 元件契約

### 4.1 主題 Hook

```tsx
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function MyComponent() {
  const { theme, fonts, fs, spacing } = useTheme();

  return (
    <View style={{ backgroundColor: theme.pageBg, padding: spacing.LG }}>
      <Text style={{ color: theme.textPrimary, fontFamily: fonts.BODY, fontSize: fs(14) }}>
        像素風格視圖
      </Text>
    </View>
  );
}
```

### 4.2 像素卡片 `PixelCard`

卡片使用 border-only 視覺：背景必須為 `theme.cardBg`，以 `theme.pixelBorderWidth` 和 `theme.borderColor` 分割。

```tsx
<PixelCard
  headerTitle="約會足跡"
  headerSubtitle="DATE MEMORIES"
  headerRight={<PixelTag label="PRO VIP" color={theme.pixelGold} size="S" />}
>
  {/* 卡片內容 */}
</PixelCard>
```

### 4.3 卡片直排標題 `CardHeaderTitle`

卡片標題使用上下直排：中文在上方（`fs(16)`），英文副標在下方（`fs(8)`、主題色）。

```tsx
<CardHeaderTitle
  title="年度預算"
  subtitle="ANNUAL VAULT"
  subtitleColor={theme.pixelGold}
/>
```

### 4.4 像素按鈕 `PixelButton`

- `S`（32px）：警報與小操作，例如 `SOS`、`SWAP`、`圖鑑`；文字不加括號。
- `M`（40px）：標準操作，例如 `[+ ADD LOG]`、`[PLAN →]`、`[儲存設定]`；元件自動加上 `[`、`]`。
- Variant：`primary`（青底黑字）、`secondary`（灰底白字）、`danger`（紅底白字）、`outline`（透明底青框）。

```tsx
<PixelButton title="儲存設定" onPress={handleSave} size="M" variant="primary" />
<PixelButton title="SOS" onPress={handleEmergency} size="S" variant="danger" />
<PixelButton title="查看圖鑑" onPress={handleView} size="M" variant="outline" />
```

### 4.5 像素標籤 `PixelTag`

- 背景必須透明，使用 `borderWidth: 1` 像素邊框。
- `S`：padding `4 × 8`、`fs(7)`；`M`：padding `6 × 10`、`fs(8)`。

```tsx
<PixelTag label="🔥 12 DAYS" color={theme.accentOrange} size="S" />
<PixelTag label="1/4 UNLOCKED" color={theme.primary} size="M" />
<PixelTag label="PRO VIP" color={theme.pixelGold} size="S" />
```

### 4.6 畫面狀態 `ScreenState`

每個 View 都必須明確處理 `loading`、`empty`、`error`、`success`。資料尚未成功時，不渲染 feature 內容；由共用狀態容器維持一致的像素視覺與重試行為。

```tsx
<ScreenState state={{ kind: 'loading' }}>
  <FeatureView />
</ScreenState>

<ScreenState
  state={{ kind: 'error', onRetry: reload, title: getCopy('STATUS_ERROR_TITLE') }}
>
  <FeatureView />
</ScreenState>
```

## 5. 開發檢查清單

- [ ] 禁止使用 `any`；未定型別使用 `unknown` 加上 type guard。
- [ ] 卡片背景 `cardBg` 與頁面背景 `pageBg` 相同。
- [ ] 標題以 2–4 字為主，最多 6 字。
- [ ] 卡片標題使用 `CardHeaderTitle` 的中英上下直排。
- [ ] 元件不寫死十六進位顏色；一律由 `themeService`／`useTheme()` 提供語意 token。
- [ ] 數字、英文 HUD 與中文內容分別使用指定像素字型。
- [ ] 主操作、危險狀態與完成狀態使用對應的語意色，不只依賴顏色傳達狀態。
