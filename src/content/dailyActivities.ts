import type { ActivityTemplate } from '@/features/activities/domain';

export const dailyActivityTemplates: readonly ActivityTemplate[] = [
  { id: 'daily-specific-praise', kind: 'daily', title: '心動小事：具體稱讚', description: '對伴侶說一件今天真心欣賞的事，不能只說「你好棒」。', reflectionPrompt: '想記下今天稱讚了什麼嗎？（選填）', reflectionPlaceholder: '例如：你今天很認真聽我說話', exp: 2 },
  { id: 'daily-song-signal', kind: 'daily', title: '心情點播', description: '傳一首歌給伴侶，讓它代表你今天的心情。', reflectionPrompt: '今天選了哪一首歌？（選填）', reflectionPlaceholder: '例如：Yesterday', exp: 2 },
  { id: 'daily-photo-window', kind: 'daily', title: '此刻的窗口', description: '傳一張此刻的照片，並用一句話告訴對方你正在做什麼。', reflectionPrompt: '想留下這張照片的描述嗎？（選填）', reflectionPlaceholder: '例如：下班路上的夕陽', exp: 2 },
  { id: 'daily-small-thanks', kind: 'daily', title: '今日感謝', description: '告訴伴侶一件你今天感謝他的事情。', reflectionPrompt: '想留下這句感謝嗎？（選填）', reflectionPlaceholder: '例如：謝謝你早上提醒我帶傘', exp: 2 },
  { id: 'daily-secret-question', kind: 'daily', title: '小秘密交換', description: '分享一個對方可能還不知道的小習慣或童年回憶。', reflectionPrompt: '今天交換了什麼？（選填）', reflectionPlaceholder: '例如：我小時候最怕打雷', exp: 2 },
  { id: 'daily-no-phone-talk', kind: 'daily', title: '十分鐘專心', description: '和伴侶聊天十分鐘，期間不滑其他 App。', reflectionPrompt: '今天聊了什麼？（選填）', reflectionPlaceholder: '例如：我們聊了下次想去的地方', exp: 2 },
];

export const milestoneActivityTemplates: readonly ActivityTemplate[] = [
  { id: 'milestone-10', kind: 'milestone', title: 'Day 10：十日小發現', description: '各自說一件認識對方後才發現的可愛習慣。', reflectionPrompt: '記下你發現的那件小事（選填）', reflectionPlaceholder: '例如：你會把喜歡的食物留到最後吃', exp: 30 },
  { id: 'milestone-50', kind: 'milestone', title: 'Day 50：默契快問快答', description: '和伴侶互問五題，看看誰更了解對方。', reflectionPrompt: '今天最有默契的一題是？（選填）', reflectionPlaceholder: '例如：我們都答了奶茶', exp: 40 },
  { id: 'milestone-100', kind: 'milestone', title: 'Day 100：百日回信', description: '寫下一件最想感謝對方的事，親自傳給他。', reflectionPrompt: '留下這封百日回信（選填）', reflectionPlaceholder: '例如：謝謝你讓我安心做自己', exp: 60 },
  { id: 'milestone-200', kind: 'milestone', title: 'Day 200：交換視角', description: '各自用三句話描述「我眼中的我們」。', reflectionPrompt: '想留下其中一句嗎？（選填）', reflectionPlaceholder: '例如：我們很會把平凡日子過得好玩', exp: 75 },
  { id: 'milestone-300', kind: 'milestone', title: 'Day 300：未來小約定', description: '一起決定一件接下來 30 天想完成的小事。', reflectionPrompt: '你們的約定是？（選填）', reflectionPlaceholder: '例如：這個月一起學會一道菜', exp: 90 },
];

export const weeklyChallengeTemplates: readonly ActivityTemplate[] = [
  { id: 'weekly-sticker-only', kind: 'weekly', title: '週末挑戰：貼圖接龍', description: '分享給伴侶，用貼圖完成一段對話，不能使用文字。完成後回來留下你們的主題。', reflectionPrompt: '你們用貼圖聊了什麼？', reflectionPlaceholder: '例如：今天的晚餐大戰', exp: 5 },
  { id: 'weekly-song-dedication', kind: 'weekly', title: '週末挑戰：給你一首歌', description: '分享給伴侶，各自指定一首歌並說明為什麼想讓對方聽。', reflectionPrompt: '填入你想送出的歌曲與一句原因', reflectionPlaceholder: '例如：Yesterday，因為想和你慢慢聽', exp: 5 },
  { id: 'weekly-three-photos', kind: 'weekly', title: '週末挑戰：三張照片猜行程', description: '分享給伴侶，傳三張照片讓對方猜你的今天，猜完再揭曉答案。', reflectionPrompt: '留下今天的行程答案', reflectionPlaceholder: '例如：咖啡店 → 書店 → 回家', exp: 5 },
  { id: 'weekly-next-date', kind: 'weekly', title: '週末挑戰：下週小約會', description: '分享給伴侶，各自提出一個下週能完成的小約會，再替對方的提案投票。', reflectionPrompt: '最後選了哪個提案？', reflectionPlaceholder: '例如：週三晚上一起散步買冰', exp: 5 },
];
