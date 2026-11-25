# LoveGame I — 設計系統與開發指南

本文件說明如何在程式中使用設計系統。**權威來源**為：

- 視覺規格：[DESIGN.md](../DESIGN.md)
- 實際數值：[tokens.ts](../src/shared/theme/tokens.ts)
- 共用元件：`src/shared/ui/`

若本文件與上述來源不一致，以上述來源為準，並更新本文件。

## 1. 設計原則

1. **掌上遊戲機介面**：方角、像素字體、遊戲選單式的版面層級；色彩為深藍黑底搭配青綠。
2. **方角框線分組**：元件以框線與表面色分組，`radius` 全部為 0，共用框線寬度 `borderWidth = 2`。卡片底色 `cardBg` 比頁面底色 `pageBg` 亮一階，不使用陰影。
3. **單一像素字體**：全站使用 `DotGothic16_400Regular`（`fonts.body`／`display`／`number` 皆指向它）。
4. **版面承載資訊**：以層級呈現事件、任務與進度，不用重複標籤與口號填補空間。
5. **顏色不單獨傳達狀態**：成功、警告、失敗一律搭配文字或圖示。

## 2. 色票

數值皆來自 `colors`，元件內不得寫死十六進位色碼。

| Token | HEX | 用途 |
| --- | --- | --- |
| `pageBg` | `#101821` | 頁面底色 |
| `cardBg` | `#15212C` | 卡片底色 |
| `subBoxBg` | `#1A2B35` | 次要區塊、導覽選取區 |
| `border` | `#5A7883` | 預設框線 |
| `text` | `#EAF6F2` | 主要文字 |
| `textMuted` | `#AEC5C8` | 輔助文字 |
| `accent` | `#58E4BB` | 品牌主色、主按鈕、焦點、選取狀態 |
| `gold` | `#E5CA80` | 獎勵、EXP |
| `orange` | `#F4B580` | 警告 |
| `danger` | `#FF8B95` | 失敗、危險操作 |
| `pink` | `#EAAFC0` | 關係、伴侶 |
| `safe` | `#86D9B0` | 成功、完成 |
| `violet` | `#B3C6D8` | 次要強調 |
| `ink` | `#101821` | 亮色填色上的深色文字 |

目前只有深色主題，沒有亮色主題。

## 3. 字型與字級

```ts
import { colors, fonts, fs, typography, spacing, radius, borderWidth } from '@/shared/theme/tokens';
```

| `typography` | 基準 px | 用途 |
| --- | --- | --- |
| `hero` | 28 | 頁面大標題 |
| `sectionTitle` | 20 | 區塊與卡片標題 |
| `cardTitle` | 17 | 卡片次標題 |
| `body` | 16 | 內文 |
| `caption` | 14 | 輔助說明、標籤文字 |
| `tag` | 13 | 狀態標籤 |
| `micro` | 12 | 最小輔助資訊 |

- `fs(size)` 會乘上 `fontScale = 1.15` 並四捨五入，需要縮放時使用。
- 首頁事件標題為 32px（行高 44），倒數為 52px（行高 64）。
- 文字必須能換行，長標題、日期與按鈕文字在手機寬度內自然換行。

### 字型載入與 fallback

App 使用 `@expo-google-fonts/dotgothic16` 與 `expo-font` 載入字體。載入期間顯示讀取畫面；若載入失敗或缺少個別繁體中文字形，使用 `fonts.fallback`（iOS 為 `Menlo`，Android／Web 為 `monospace`）繼續顯示。字型載入失敗不得阻擋使用者登入或操作，也不視為致命錯誤。

## 4. 間距與框線

```ts
spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }
radius = { none: 0, xs: 0, sm: 0, md: 0 }
borderWidth = 2   // 首頁事件主框為 3
```

頁面內容單欄、置中、最大寬度 720；內容區外距與區塊間距為 `xl`。

## 5. 共用元件

皆位於 `src/shared/ui/`，由 `index.ts` 匯出。新畫面優先使用這些元件，不另建樣式相近的元件。

### 5.1 `AppButton`

```tsx
<AppButton label="儲存" onPress={save} />                       // 主要：青綠填色、深色文字
<AppButton label="取消" onPress={close} secondary />            // 次要：透明底、青綠框線
<AppButton label="刪除" onPress={remove} tone="danger" />       // 危險
<AppButton label="略過" onPress={skip} size="S" disabled />     // 小尺寸、停用
```

- `size`：`M` 最低高度 52，`S` 最低高度 48（皆符合觸控目標下限）。
- 按壓透明度 0.78，停用 0.45；文字可換行；已宣告 `accessibilityRole="button"`。

### 5.2 `PixelCard`

```tsx
<PixelCard title="下一個任務" subtitle="今天" trailing={<PixelTag label="進行中" />}>
  {/* 內容 */}
</PixelCard>
```

底色 `cardBg`、內距 `lg`、內容間距 `md`。`accentColor` 控制框線顏色（預設 `border`），用來表達狀態。`title`、`subtitle`、`trailing` 皆為選填，未提供 `title` 時不顯示標題列。

### 5.3 `PixelTag`

```tsx
<PixelTag label="曖昧" color={colors.pink} />
<PixelTag label="已完成" color={colors.safe} size="M" />
```

透明底、細框、顏色同時作用於框線與文字；`size` 為 `S`（預設）或 `M`；文字可換行。

### 5.4 `PixelIcon`

所有圖示使用 Pixelarticons，經 `PixelIcon` 呈現；主要導覽圖示尺寸 24。不得混用不同筆畫風格的文字符號或 emoji 當圖示。

### 5.5 `ScreenState`

每個 View 都要明確處理 `loading`、`empty`、`error`、`success`；資料未成功時不渲染 feature 內容。

```tsx
<ScreenState state={{ kind: 'loading', label: '讀取中' }}>
  <FeatureView />
</ScreenState>

<ScreenState state={{ kind: 'error', title: '載入失敗', copy: '請稍後再試', onRetry: reload }}>
  <FeatureView />
</ScreenState>

// empty：{ kind: 'empty', title, copy }；success：{ kind: 'success' }
```

### 5.6 其他

`Dialog`、`BottomSheet`、`PageLayout`、`ProgressBar`、`StatusBadge`、`MissionCard`、`RewardSummary`、`DateField` 等依各自檔案的 props 使用。

### 5.7 導覽

行動版底部導覽將各目的地等寬分配；每個項目最低高度 56，使用圖示加文字標籤，選取項目的圖示與文字採 `accent` 並以 `subBoxBg` 標示區域，並透過 `accessibilityState` 公告選取狀態。

## 6. 開發檢查清單

- [ ] 禁止使用 `any`；未定型別使用 `unknown` 加上 type guard。
- [ ] 顏色、字級、間距、框線一律取自 `tokens.ts`，不寫死數值。
- [ ] 沿用 `AppButton`、`PixelCard`、`PixelTag`、`PixelIcon`、`ScreenState`。
- [ ] 方角（`radius` 皆為 0）；若有刻意例外，需在 `DESIGN.md` 註明。
- [ ] 320px 寬度無橫向溢出，長文字可換行。
- [ ] 互動元件具備 `accessibilityRole`／`accessibilityState`，觸控目標不小於 48。
- [ ] 狀態以文字或圖示搭配顏色表達，不只依賴顏色。
- [ ] 資料存取經 repository、外部服務經 adapter、遊戲數值由 domain 層管理；介面只讀取結果並轉交操作。
