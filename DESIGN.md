---
name: LoveGame I
description: 掌上遊戲機介面與青綠配色
colors:
  primary: "#58E4BB"
  page-bg: "#101821"
  card-bg: "#15212C"
  surface-variant: "#1A2B35"
  outline: "#48626C"
  text: "#EAF6F2"
  text-muted: "#AEC5C8"
  reward: "#E5CA80"
  warning: "#F4B580"
  error: "#FF8B95"
  relationship: "#EAAFC0"
  success: "#86D9B0"
  secondary: "#B3C6D8"
typography:
  headline:
    fontFamily: DotGothic16_400Regular
    fontSize: "28px"
  title:
    fontFamily: DotGothic16_400Regular
    fontSize: "20px"
  body:
    fontFamily: DotGothic16_400Regular
    fontSize: "16px"
  label:
    fontFamily: DotGothic16_400Regular
    fontSize: "14px"
  micro:
    fontFamily: DotGothic16_400Regular
    fontSize: "12px"
rounded:
  xs: "0px"
  sm: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.page-bg}"
    rounded: "{rounded.xs}"
    padding: "12px"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
  card:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
---

# LoveGame I Design System

## Overview

使用者選定「掌上遊戲機」的方框、像素字體與遊戲選單，搭配「現代像素冒險」的深藍黑與青綠。以版面層級呈現事件、任務與進度，文字保留完成操作與理解狀態所需的資訊。

本文件記錄現有實作。規格來源為[共用 tokens](src/shared/theme/tokens.ts)。

## Colors

青綠用於主要操作及焦點，深藍黑為頁面底色，卡片與選取區使用較亮的表面色。淺色文字承載主要資訊，柔和藍灰文字呈現輔助資訊。獎勵、警告、失敗、關係及成功沿用各自的語意色。

## Typography

全體採用 DotGothic16 像素字體。共用字級包括標題、區塊標題、內文、標籤與輔助資訊。首頁事件標題使用 32px 與 44px 行高，倒數為 52px 與 64px 行高。內文保持換行能力，長文以行高和段落間距區分。

## Layout

頁面內容採單欄，置中且最大寬度 720。共用內容區外距與區塊間距為 xl。首頁以重要日主框呈現日期、事件、剩餘時間、路線及主要操作，後續呈現下一個任務和遊戲數值。行動版底部導覽將各目的地等寬分配。

## Elevation & Depth

目前主要元件以表面色及框線分組。主要事件框比一般卡片更突出，選取導覽以表面色區分。

## Shapes

元件採方角。共用框線寬度為 2，首頁事件主框為 3。Pixelarticons 以同一個共用元件呈現，主要導覽圖示尺寸為 24。

## Components

### Buttons

主要按鈕為青綠填色、深色文字與淺色框線，次要按鈕為透明底與青綠框線。一般尺寸最低高度 52，小尺寸最低高度 48。按壓透明度為 0.78，停用為 0.45。文字可換行，透過 accessibilityRole 宣告操作。

### Cards

卡片使用 card-bg，內距 lg，內容間距 md。標題區可有輔助文字與右側操作。輔助文字使用 text-muted，框線依狀態指定。

### Inputs

關係資料表單使用文字輸入欄、方角框線及文字標籤。輸入值與錯誤由現有表單流程管理。欄位最低高度以實作為準，關係編輯主要選項為 48。

### Navigation

使用 Pixelarticons 與文字標籤。選取項目的圖示與文字採 primary，並以 surface-variant 標示區域。每個導覽項目最低高度 56，透過 accessibilityState 公告選取狀態。

### Tags

以細框與像素字體呈現狀態或偏好，文字能在可用寬度內換行。

## Do's and Don'ts

- Do 沿用共用 tokens、PixelIcon 與 AppButton。
- Do 讓長標題、日期、按鈕文字在手機寬度內自然換行。
- Do 保留狀態文字與無障礙標籤，配色搭配文字表達結果。
- Don't 為圖示引入不同筆畫風格的文字符號。
- Don't 用重複標籤與口號填補空間。
