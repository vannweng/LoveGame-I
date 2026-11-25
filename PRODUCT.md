# LoveGame I

<!-- impeccable:product-schema 1 -->

## Platform

android

## Stack

React Native、Expo、TypeScript。Expo Web 提供本機預覽。

## Users

為重要日準備行動、追蹤任務與回顧故事的玩家。現有流程涵蓋有伴侶、單身練習與曖昧對象。

## Product Purpose

將生日、紀念日與自訂日期轉為可執行的準備旅程，透過任務結算、EXP、Combo、Rank 與篇章收藏呈現進度。

## Operating Context

首頁查看重要日及下一個任務，任務頁開始或繼續旅程，完成後保存準備手記與心得。關係資料頁管理日期及偏好。詳細流程見[核心旅程](docs/core-journey-v1.md)。

## Capabilities and Constraints

目前旅程使用本機 repository。任務結果與遊戲數值由 domain 層管理，介面讀取結果並轉交操作。資料存取經 repository，外部服務經 adapter。正式雲端旅程、跨裝置同步及 Android 實機驗證的完成狀態以專案文件為準。

## Brand Commitments

名稱為「戀愛別裝忙」。使用者選定掌上遊戲機介面語言，搭配現代像素冒險的深藍黑、青綠與淺色文字。保留 Pixelarticons 圖示。

## Evidence on Hand

產品流程與規則見 [README](README.md)、[核心旅程](docs/core-journey-v1.md)、[遊戲規則](docs/game-rules-v0.2.md)。視覺規格見 [DESIGN.md](DESIGN.md)。
