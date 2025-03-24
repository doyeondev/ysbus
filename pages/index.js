// import ReactDOM from 'react-dom'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '/components/layout'
import Image from 'next/image'

import { yongsan } from 'utils/busData'

export default function YongsanBus() {
  const [testMode, setTestMode] = useState(true)
  const [testTime, setTestTime] = useState('11:55AM')
  const [startTime, setStartTime] = useState(5) // 첫 버스가 출발하는 시간: 오전 5시
  const [busTimeList, setBusTimeList] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const [upcomingBus, setUpcomingBus] = useState([])
  const [screenSize, setScreenSize] = useState('')

  /** 두 시간의 차이를 계산하는 함수 */
  const getTimeDiff = (date1, date2) => {
    // testMode일 때는 testTime 기준으로 계산
    const d1 = testMode ? new Date(parseTime(testTime)).getTime() : new Date(date1).getTime()
    const d2 = new Date(date2).getTime()
    return Math.round((d2 - d1) / 60000) // 분 단위로 변환
  }

  useEffect(() => {
    setScreenSize(window.innerWidth)
    const timeStringList = []

    for (let i = 0; i < yongsan.length; i++) {
      for (let j = 0; j < yongsan[i].length; j++) {
        timeStringList.push(formatTimeString(`${i + startTime}:${yongsan[i][j]}`))
      }
    }

    setBusTimeList(timeStringList)
    initTimeData()
  }, [])

  useEffect(() => {
    if (busTimeList.length > 0) {
      findNextBus()
    }
  }, [busTimeList])

  /** 화면에 보여지는 현재시간을 가져옴 */
  function initTimeData() {
    const t = testMode === true ? new Date(parseTime(testTime)).toTimeString().substring(0, 8) : new Date().toTimeString().substring(0, 8)
    setCurrentTime(t)
    findNextBus()
  }

  /** 1초마다 현재시간 새로고침 */
  useEffect(() => {
    if (testMode === false) {
      // 초기 실행
      initTimeData()

      // 1초마다 실행
      const intervalId = setInterval(initTimeData, 1000)

      // 컴포넌트 언마운트 시 interval 정리
      return () => clearInterval(intervalId)
    }
  }, [testMode])

  /** 다음 버스가 언제 출발하는지 리턴해주는 함수 */
  function findNextBus() {
    if (busTimeList.length === 0) return

    const d = testMode === true ? new Date(parseTime(testTime)) : new Date()

    // 현재 시간 기준으로 다음 버스를 찾기 위한 시간 설정
    let currentDate = new Date(d)

    // 현재 시간 이후의 버스 찾기
    const currentDayBuses = busTimeList.map((time) => new Date(parseTime(time))).filter((time) => time.valueOf() > currentDate.valueOf())

    // 다음날 버스 시간표 생성
    let nextDayBusTimeList = []

    // 현재 시간이 23시 이후거나 5시 이전이거나, 남은 버스가 2개 이하일 때 다음날 버스 추가
    if (currentDate.getHours() >= 23 || currentDate.getHours() < 5 || currentDayBuses.length <= 2) {
      nextDayBusTimeList = busTimeList.map((time) => {
        const nextDayTime = new Date(parseTime(time))
        nextDayTime.setDate(nextDayTime.getDate() + 1)
        return nextDayTime
      })
    }

    // 다음날 첫차까지 포함한 전체 버스 목록
    const allUpcomingBuses = [...currentDayBuses, ...nextDayBusTimeList].filter((time) => time.valueOf() > currentDate.valueOf()).sort((a, b) => a.valueOf() - b.valueOf())

    if (allUpcomingBuses.length === 0) return

    // 최대 4개까지만 보여주기
    const nextBuses = allUpcomingBuses.slice(0, 4)
    setUpcomingBus(nextBuses)
  }

  return (
    <>
      <Layout>
        <Head>
          <title>용산03 경리단길</title>
          <meta className="description" content="용산03 경리단길" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="w-full">
          <div className="flex h-screen flex-col">
            <div className="flex h-full w-full flex-col place-content-center items-center space-y-8 bg-[#1DB807] px-4 pb-6 pt-12 dark:bg-slate-800 sm:px-[10vw] sm:pb-10 sm:pt-16">
              <div className="mt-4 rounded-md bg-[#E8F9E8] px-4 py-4 md:mt-3">
                <Image alt="용산03" src="/icon/yongsan_light.svg" width={0} height={0} sizes="100vw" className="justify-cente w-[480px]" />
              </div>
              <main className="mx-auto flex w-full flex-col place-content-center items-center pt-2 text-base text-white sm:text-base md:pt-4 md:text-2xl">
                <div className="flex place-content-center items-center space-x-8 md:space-x-16">
                  <div className="flex w-fit text-center font-bold">
                    <p className="text-white">
                      다음 하얏트 출발
                      <br />
                      <span className="text-white">
                        {getTimeDiff(new Date(), upcomingBus[0])}분 후 <span className="">({new Date(upcomingBus[0]).toTimeString().substring(0, 5)})</span>
                      </span>
                    </p>
                  </div>
                  <div className="flex w-fit text-center font-bold">
                    <p className="text-white">
                      그 다음 하얏트 출발
                      <br />
                      <span className="text-white">
                        {getTimeDiff(new Date(), upcomingBus[1])}분 후 <span className="">({new Date(upcomingBus[1]).toTimeString().substring(0, 5)})</span>
                      </span>
                    </p>
                  </div>
                </div>
              </main>
            </div>
            <div className="mx-auto w-screen px-[6vw] py-12 dark:bg-slate-700 sm:px-[12vw] sm:py-12 md:px-[14vw] lg:px-[20vw] xl:px-[25vw]">
              <div className="mx-auto flex w-full flex-col place-content-center items-center text-center text-2xl font-bold md:text-3xl">
                용산03 도착정보
                <br />
                <span className="text-lg text-blue-500 dark:text-blue-300 md:pt-1 md:text-xl">(현재시간 {currentTime})</span>
              </div>
              <div className="mx-auto pt-8">
                <p className="pb-2 text-xs font-semibold md:text-sm">하얏트호텔 → 남영 방향 입니다. (경리단길 하행선 버스탑승 시간표)</p>
                <TableSchedule upcomingBus={upcomingBus} screenSize={screenSize} testMode={testMode} testTime={testTime} getTimeDiff={getTimeDiff} />
                <p className="pb-2 pt-2 text-right text-xs font-semibold md:text-sm">
                  * 본 시간표는 용산03 출발 시간표를 기준으로 제작되었습니다
                  <br /> * 운행 지연 등의 사유로 실제 도착시간에 차이가 있을 수 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

function TableSchedule({ upcomingBus, screenSize, testMode, testTime, getTimeDiff }) {
  const now = testMode ? new Date(parseTime(testTime)) : new Date()

  return (
    <>
      <table className="h-full w-[100%] table-fixed divide-y divide-gray-200 rounded dark:divide-gray-700">
        <thead>
          {stations.map((station, i) => {
            return (
              <tr key={`row${i}`} className="text-[14px] hover:bg-slate-50 dark:hover:bg-slate-600 sm:text-sm md:text-base">
                <td className="md:px6 w-[22%] border bg-gray-50 text-center font-bold dark:bg-slate-900 md:w-[20%]">
                  {screenSize < 800 && station.str1 ? (
                    <>
                      <p className={`${[2, 3].includes(i) ? '' : ''}`}>
                        {station.str1} <br /> {station.str2}
                      </p>
                    </>
                  ) : (
                    station.name
                  )}
                </td>
                {upcomingBus.map((bus, i) => {
                  let busArrivalTime = addMinutes(new Date(bus), station.leadTime)
                  return (
                    <td key={i} className={`md:px6 w-[26%] border px-1 py-2 text-center text-[15px] text-red-500 dark:text-rose-500 sm:text-sm md:w-[20%] md:text-base ${[3].includes(i) && screenSize < 768 && 'hidden'}`}>
                      {getTimeDiff(now, bus) + station.leadTime}분 뒤<br />
                      <p className="flex w-full place-content-center text-[13px] text-gray-500 dark:text-gray-300 sm:text-sm md:text-[15px]">
                        ({shortenTime(busArrivalTime)}
                        <span className="hidden md:block">&nbsp;{station.name.includes('하얏트') ? '출발' : '도착'}</span>)
                      </p>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </thead>
      </table>
    </>
  )
}

/** ex) '오후 23:00:00' -> '23:00'으로 줄여주는 함수 */
function shortenTime(time) {
  return time.toTimeString().substring(0, 5)
}

/**
 * date에 minutes를 더해주는 함수
 * 종점에서 버스 출발 이후, 각 정류장까지 걸리는 시간을 더해주기 위해 사용함
 */
function addMinutes(date, minutes) {
  date.setMinutes(date.getMinutes() + minutes)
  return date
}

/** 문자열 "10:30" 시간을 -> 날짜 데이터 리턴해줌 */
function parseTime(timeString) {
  if (timeString == '') return null

  const time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i)
  if (time == null) return null

  var hours = parseInt(time[1], 10)
  if (hours == 12 && !time[4]) {
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

/**
 * 예: 11:5 -> 11:05AM로 리턴해줌
 * 11:5이면 날짜 변환이 안되서 format을 맞춰준다
 * 그리고 AM, PM을 안 적어주면 12시의 경우 00시와 혼동되기 때문에 AM, PM 포맷을 맞춰주고
 */
function formatTimeString(timeString) {
  const targetIndex = timeString.indexOf(':')
  let hour, minute, formattedTime

  if (targetIndex === 1) {
    // 시간이 한자리인 경우. 예) 5:50
    hour = timeString.substring(0, 1)
    minute = timeString.substring(2)
  } else {
    // 시간이 두자리인 경우
    hour = timeString.substring(0, 2)
    minute = timeString.substring(3)
  }

  if (hour < 12) {
    formattedTime = minute < 10 ? `${hour}:0${minute}AM` : `${hour}:${minute}AM`
  } else {
    formattedTime = minute < 10 ? `${hour}:0${minute}PM` : `${hour}:${minute}PM`
  }
  return formattedTime
}

/** 정류장 이름과 종점에서부터의 소요시간 */
const stations = [
  { name: '하얏트호텔(기점)', str1: '하얏트', str2: '기점출발', leadTime: 0 },
  { name: '필리핀대사관', str1: '필리핀', str2: '대사관', leadTime: 1 },
  { name: '가야랑앞', leadTime: 2 },
  { name: '디지텍고등학교', str1: '디지텍', str2: '고등학교', leadTime: 3, highlight: true },
  { name: '성도약국', leadTime: 4, highlight: true },
  { name: '시장', leadTime: 4 }
]
