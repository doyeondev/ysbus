export function timestamp() {
  const today = new Date()
  today.setHours(today.getHours() + 9)
  return today.toISOString().replace('T', ' ').substring(0, 19)
}

export function timeDiffSec(start: Date | string, end: Date | string): number {
  let timeStart = new Date(start)
  let timeEnd = new Date(end)
  // let timeStart = new Date('2012-10-09 12:00')
  // let timeEnd = new Date('2013-10-09 12:00')
  // console.log('timeStart', timeStart)
  // console.log('timeEnd', timeEnd)

  let difference = timeEnd.getTime() - timeStart.getTime() // This will give difference in milliseconds
  let resultInSeconds = Math.round(difference / 1000)
  return resultInSeconds
}

export function timeDiffMin(start: Date | string, end: Date | string): number {
  let timeStart = new Date(start)
  let timeEnd = new Date(end)
  // let timeStart = new Date('2012-10-09 12:00')
  // let timeEnd = new Date('2013-10-09 12:00')
  // console.log('timeStart', timeStart)
  // console.log('timeEnd', timeEnd)

  let difference = timeEnd.getTime() - timeStart.getTime() // This will give difference in milliseconds
  let resultInMinutes = parseFloat((difference / 1000 / 60).toFixed(2))
  // console.log('resultInMinutes', resultInMinutes)
  return resultInMinutes
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function addMinutes(date: Date, minutes: number): Date {
  const newDate = new Date(date)
  newDate.setMinutes(date.getMinutes() + minutes)
  return newDate
}

export function parseTime(timeString: string): Date {
  if (!timeString) throw new Error('Empty time string')

  const time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i)
  if (!time) throw new Error('Invalid time format')

  let hours = parseInt(time[1], 10)
  if (hours === 12 && !time[4]) {
    hours = 0
  } else {
    hours += hours < 12 && time[4] ? 12 : 0
  }
  const d = new Date()
  d.setHours(hours)
  d.setMinutes(parseInt(time[3], 10) || 0)
  d.setSeconds(0, 0)
  return d
}

export function formatTimeString(timeString: string): string {
  const targetIndex = timeString.indexOf(':')
  let hour: string
  let minute: string

  if (targetIndex === 1) {
    // 시간이 한자리인 경우. 예) 5:50
    hour = timeString.substring(0, 1)
    minute = timeString.substring(2)
  } else {
    // 시간이 두자리인 경우
    hour = timeString.substring(0, 2)
    minute = timeString.substring(3)
  }

  const hourNum = parseInt(hour, 10)
  const minuteNum = parseInt(minute, 10)

  if (hourNum < 12) {
    return minuteNum < 10 ? `${hour}:0${minute}AM` : `${hour}:${minute}AM`
  } else {
    return minuteNum < 10 ? `${hour}:0${minute}PM` : `${hour}:${minute}PM`
  }
}
