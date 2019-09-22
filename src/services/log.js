/**
 * @file Logger service
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

import config from '../config'

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, colorize, printf, align, simple, json } = format

/**
 * Logging
 */

const optionsLog = combine(
  colorize({all: true}),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  label({
    label: '[iSTORY]'
  }),
  simple(),
  align(),
  printf(info => `${info.label} ${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(info, ['name', 'statusCode', 'errorCode'] , 10)}`)
)

const optionsFile = combine(
  label({
    label: 'iStoryLog'
  }),
  timestamp(),
  json()
)

const log = createLogger({
  transports: [
    new transports.Console({
      // silent: config.test ? true : false,
      format: optionsLog,
    }),
    new transports.File({
      filename: 'log/error.log',
      silent: config.test ? true : false,
      level: 'error',
      format: optionsFile
    }),
    new transports.File({ filename: 'log/combined.log' })
  ]
})

export default log
