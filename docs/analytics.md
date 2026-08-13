# MVP Analytics

## 事件表

| 分類 | 事件 |
| --- | --- |
| 基礎使用 | `app_open`（由 Firebase Analytics 自動收集）、`onboarding_complete`、`home_view` |
| Gameplay Funnel | `mission_create`、`mission_view`、`mission_start`、`mission_complete`、`reward_view` |
| 任務異常結果 | `mission_late`、`mission_fail` |
| 遊戲成長 | `rank_up`、`rank_down`、`collection_unlock`、`gg` |
| 關係資料 | `relationship_event_create` |

`app_open` 不可由 app 手動重複送出，避免和 Firebase Analytics 自動事件重複計數。`mission_create` 已先定義事件契約，待真實 Mission Generation use case 接入時才上報；目前 mock／讀取資料不得假造建立事件。

## 任務共用參數

| 參數 | 用途 |
| --- | --- |
| `mission_id` | 串起同一任務的漏斗流程 |
| `mission_type` | 生日、紀念日等事件分類 |
| `mission_source` | `system`、`reminder` 或 `user` |
| `difficulty` | `easy`、`normal`、`hard` |
| `days_before_due` | 距成功截止日的天數；逾期可為負數 |
| `exp_delta` | 本次結算 EXP 增減 |
| `rank_before` / `rank_after` | Rank 變化分析 |
| `collection_type` | 收藏分類，例如 `title`、`grave` |

禁止送出：伴侶姓名、email、電話、完整日期、任務文案、禮物內容／備註、精確位置，以及其他可直接或間接識別關係資料的內容。

## Google Analytics 漏斗

Google Analytics → 探索 → 漏斗探索：

1. `mission_create`
2. `mission_view`
3. `mission_start`
4. `mission_complete`
5. `reward_view`

事件在 application/composition 層呼叫，經 `AnalyticsService` adapter 傳送。開發環境的 adapter 只寫入 console；正式版接入服務時，只替換 adapter，不改 View 或事件呼叫端。
