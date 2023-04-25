import formatDateFromNow from './format-date-from-now'
import eventBus from './event-bus'
const prodMode = process.env.NODE_ENV === 'production' ? true : false

export {
  prodMode,
  formatDateFromNow,
  eventBus
}