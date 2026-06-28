// Public API for the daily feature.
// Import only from this file — never from internal screens or hooks directly.

export { default as DailyScreen } from './screens/DailyScreen'
export type { DailyScreenProps } from './screens/DailyScreen'
export {
  getTodayDate,
  getDailyNumber,
  getDailyProblems,
  buildShareText,
  formatCountdown,
  msUntilMidnight,
  DAILY_PROBLEM_COUNT,
  EPOCH_ISO,
} from './dailyChallenge'
