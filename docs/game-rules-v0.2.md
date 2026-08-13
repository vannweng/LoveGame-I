# Game Rules v0.2

## 名詞

### 紀念日（Important Date）

關係設定中的準確日期，例如交往紀念日、結婚紀念日、生日與自訂重要日期。紀念日是該輪任務的最終截止基準。

### 事件日／任務日（Event Date）

為某個紀念日預先安排任務的日期。例如「紀念日 -29 天」產生訂餐廳任務，其事件日即為紀念日的 29 天前。

### 時區與時間真相

所有日期均以 `LoveSave.timezone` 解析為日曆日期；任務結算只使用 server time。裝置本機時間不具有判定權。

## 任務生命週期

```text
scheduled → active → resolved
                     ├─ success
                     ├─ late
                     └─ fail
```

玩家可以完成或主動放棄任務。若紀念日當天 00:00 前未有任何結算，系統自動將任務判定為 Fail。

## 結果判定

每個任務模板各自定義 `successDays`。事件日當天算第 1 個 Success 日。

```text
successUntil = eventDate + successDays 天的 00:00
failAt       = targetImportantDate 的 00:00

now < successUntil                     → Success
successUntil <= now < failAt           → Late
now >= failAt                           → Fail
player abandons before resolution      → Fail
```

例如，紀念日為 8/20、訂禮物事件日為 8/5、`successDays = 5`：

```text
8/5 00:00 ～ 8/10 23:59:59  → Success
8/11 00:00 ～ 8/19 23:59:59 → Late
8/20 00:00 起               → Fail
```

## 預設生存任務模板

| 任務 | 事件日（距紀念日） | Success 天數 | Success 截止（不含） |
|---|---:|---:|---|
| 訂餐廳 | -29 天 | 9 | 事件日 +10 天 00:00 |
| 訂禮物 | -15 天 | 5 | 事件日 +6 天 00:00 |
| 訂電影院 | -9 天 | 3 | 事件日 +4 天 00:00 |
| 寫卡片 | -5 天 | 2 | 事件日 +3 天 00:00 |
| 確認行程 | -3 天 | 1 | 事件日 +2 天 00:00 |

以 8/20 紀念日為例：

| 任務 | 事件日 | Success 截止（不含） | Late 區間 |
|---|---|---|---|
| 訂餐廳 | 7/22 | 8/1 00:00 | 8/1 00:00 ～ 8/20 00:00 前 |
| 訂禮物 | 8/5 | 8/11 00:00 | 8/11 00:00 ～ 8/20 00:00 前 |
| 訂電影院 | 8/11 | 8/15 00:00 | 8/15 00:00 ～ 8/20 00:00 前 |
| 寫卡片 | 8/15 | 8/18 00:00 | 8/18 00:00 ～ 8/20 00:00 前 |
| 確認行程 | 8/17 | 8/19 00:00 | 8/19 00:00 ～ 8/20 00:00 前 |

所有未結算任務在 8/20 00:00 自動 Fail。

## Progression

| 結果 | EXP | Combo | Survival Rank |
|---|---|---:|---:|
| Success | 增加；數值待定 | +1 | +1 |
| Late | 增加或 0；數值待定 | 保留 | 0 |
| Fail | 0，且不扣除既有 EXP | 歸零 | -1 |

- Rank Score 範圍固定為 `-10` 到 `+10`，初始為 `0`。
- 只有 `importance = survival` 的任務會影響 Rank。
- Combo 是連續成功處理 survival events 的計數，不是登入天數。
- EXP 原則只增加，不扣除。
- Rank 變動必須 clamp 至合法範圍。

## 任務重要性

```text
survival：Rank 規則生效
normal：不影響 Rank；仍可套用 EXP、Combo、收藏規則
```

模板可提供預設重要性，玩家建立自訂日期時可選擇覆寫。任務生成時必須將重要性快照寫入 Mission；後續修改日期設定不可回溯改變既有任務。

## GG 與復活

1. Survival 任務 Fail 使 Rank 到 `-10` 時，進入 `gg`。
2. 解鎖墓碑收藏（只解鎖一次）。
3. 仍發送一般任務提醒，但降低頻率；復活任務提醒最高優先。
4. GG 期間一般任務可完成、可取得 EXP／收藏，但 Rank 不再低於 `-10`；一般 Success 不會使玩家復活。
5. 完成 Revival Mission 後，Rank 恢復至 `-5`，Combo 設為 `0`，既有 EXP 不變。
6. 墓碑保留在圖鑑中，復活後不移除。

## 尚待決定

- 各類任務 Success 與 Late 的 EXP 數值。
- Revival Mission 的具體內容、期限與獎勵。
- 各模板的預設 importance，以及哪些模板可被玩家覆寫。
