// Station order follows Taipei Metro's route map. Times are planning estimates,
// not published timetable data: 3 min/stop, 8 min/change, 8 min/initial wait.
export const metroLines = [
  { name: '淡水信義線', stations: ['象山', '台北101/世貿', '信義安和', '大安', '大安森林公園', '東門', '中正紀念堂', '台大醫院', '台北車站', '中山', '雙連', '民權西路', '圓山', '劍潭', '士林'] },
  { name: '板南線', stations: ['西門', '台北車站', '善導寺', '忠孝新生', '忠孝復興', '忠孝敦化', '國父紀念館', '市政府', '永春', '後山埤'] },
  { name: '松山新店線', stations: ['中正紀念堂', '小南門', '西門', '北門', '中山', '松江南京', '南京復興', '台北小巨蛋', '南京三民', '松山'] },
  { name: '文湖線', stations: ['大安', '忠孝復興', '南京復興'] },
] as const;

export const supportedMetroStations: readonly string[] = [...new Set(metroLines.flatMap((line) => [...line.stations]))];
