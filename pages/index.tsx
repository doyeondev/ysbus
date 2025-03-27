import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Image from 'next/image'
import { yongsan } from '../utils/busData'
import { formatTime, addMinutes, parseTime, formatTimeString } from '../utils/timeUtils'

// 인터페이스 정의
interface Station {
  name: string
  str1?: string
  str2?: string
  leadTime: number
  highlight?: boolean
}

interface TableScheduleProps {
  upcomingBus: Date[]
  screenSize: number
  testMode: boolean
  testTime: string
  getTimeDiff: (date1: Date, date2: Date) => number
}

export default function YongsanBus(): JSX.Element {
  const [testMode, setTestMode] = useState<boolean>(false)
  const [testTime, setTestTime] = useState<string>('7:48PM')
  const [startTime, setStartTime] = useState<number>(5)
  const [busTimeList, setBusTimeList] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState<string>('')
  const [upcomingBus, setUpcomingBus] = useState<Date[]>([])
  const [screenSize, setScreenSize] = useState<number>(0)

  /** 다음 버스가 언제 출발하는지 리턴해주는 함수 
   * 1. 현재 시간 이후의 버스만 필터링
   * 2. 오늘과 내일의 버스 시간을 모두 포함
   * 3. 시간순으로 정렬하여 다음 4대 선택
   */
  function findNextBus() {
    if (busTimeList.length === 0) return

    const d = testMode === true ? new Date(parseTime(testTime)) : new Date()
    let currentDate = new Date(d)

    // 현재 시간 기준으로 운행 중인 버스와 앞으로 출발할 버스 찾기
    const allBuses = busTimeList.map((time) => {
      const departureTime = new Date(parseTime(time))
      // 마지막 정류장(시장)까지 도착하는데 걸리는 시간 (4분)
      const arrivalTime = new Date(departureTime)
      arrivalTime.setMinutes(arrivalTime.getMinutes() + 4)

      // 운행 중인 버스는 현재 출발 시간보다 이전이지만 도착 시간은 아직 지나지 않은 버스
      const isRunning = departureTime <= currentDate && currentDate <= arrivalTime

      return {
        departureTime,
        arrivalTime,
        isRunning
      }
    })

    // 다음날 버스 시간표 생성
    const runningBuses = allBuses.filter(bus => bus.isRunning)
    const upcomingBuses = allBuses.filter(bus => bus.departureTime > currentDate)

    let nextDayBuses: Array<{ departureTime: Date, arrivalTime: Date, isRunning: boolean }> = []
    if (currentDate.getHours() >= 23 || currentDate.getHours() < 5 || (runningBuses.length + upcomingBuses.length) <= 2) {
      nextDayBuses = busTimeList.map((time) => {
        const departureTime = new Date(parseTime(time))
        departureTime.setDate(departureTime.getDate() + 1)
        const arrivalTime = new Date(departureTime)
        arrivalTime.setMinutes(arrivalTime.getMinutes() + 4)
        return {
          departureTime,
          arrivalTime,
          isRunning: false
        }
      })
    }

    // 모든 버스를 시간순으로 정렬
    const sortedBuses = [...runningBuses, ...upcomingBuses, ...nextDayBuses]
      .sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime())

    if (sortedBuses.length === 0) return

    // 최대 4개까지만 보여주기
    const nextBuses = sortedBuses.slice(0, 4).map(bus => bus.departureTime)
    setUpcomingBus(nextBuses)
  }

  /** 두 시간의 차이를 계산하는 함수 
   * @param date1 기준 시간 (현재 시간)
   * @param date2 비교할 시간 (버스 도착 시간)
   * @returns 두 시간의 차이 (분 단위)
   */
  const getTimeDiff = (date1: Date, date2: Date): number => {
    const d1 = testMode ? new Date(parseTime(testTime)) : new Date(date1)
    const d2 = new Date(date2)
    const diffInMinutes = Math.round((d2.getTime() - d1.getTime()) / 60000)

    // 음수인 경우 (이미 지난 버스) 다음날 시간으로 계산
    if (diffInMinutes < 0) {
      const nextDay = new Date(d2)
      nextDay.setDate(nextDay.getDate() + 1)
      return Math.round((nextDay.getTime() - d1.getTime()) / 60000)
    }

    return diffInMinutes
  }

  /** 화면에 보여지는 현재시간을 가져오고 버스 시간을 업데이트하는 함수 
   * - 테스트 모드일 경우 testTime 사용
   * - 일반 모드일 경우 실제 현재 시간 사용
   */
  function initTimeData() {
    const t = testMode === true ? new Date(parseTime(testTime)).toTimeString().substring(0, 8) : new Date().toTimeString().substring(0, 8)
    setCurrentTime(t)
    findNextBus()
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
  }, [])

  useEffect(() => {
    if (busTimeList.length > 0) {
      initTimeData()
      findNextBus()
    }
  }, [busTimeList])

  /** 1초마다 현재시간과 버스 시간을 새로고침하는 effect */
  useEffect(() => {
    if (testMode === false && busTimeList.length > 0) {
      initTimeData()
      const intervalId = setInterval(() => {
        initTimeData()
        findNextBus()
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [testMode, busTimeList])

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
            <div className="flex h-full w-full flex-col place-content-center items-center space-y-8 bg-[#1DB807] dark:bg-slate-800 px-4 pb-6 pt-12 sm:px-[10vw] sm:pb-10 sm:pt-16">
              <div className="mt-4 rounded-md bg-[#E8F9E8] px-4 py-4 md:mt-3">
                <Image alt="용산03" src="/icon/yongsan_light.svg" width={0} height={0} sizes="100vw" className="justify-cente w-[480px]" />
              </div>
              <main className="mx-auto flex w-full flex-col place-content-center items-center pt-2 text-base text-white dark:text-white sm:text-base md:pt-4 md:text-2xl">
                <div className="flex place-content-center items-center space-x-8 md:space-x-16">
                  <div className="flex w-fit text-center font-bold">
                    <p className="text-white dark:text-white">
                      다음 하얏트 출발
                      <br />
                      <span className="text-white dark:text-white">
                        {upcomingBus[0] ? `${getTimeDiff(new Date(), upcomingBus[0])}분 후` : '-'}
                        <span className="">
                          {upcomingBus[0] ? `(${new Date(upcomingBus[0]).toTimeString().substring(0, 5)})` : ''}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="flex w-fit text-center font-bold">
                    <p className="text-white dark:text-white">
                      그 다음 하얏트 출발
                      <br />
                      <span className="text-white dark:text-white">
                        {upcomingBus[1] ? `${getTimeDiff(new Date(), upcomingBus[1])}분 후` : '-'}
                        <span className="">
                          {upcomingBus[1] ? `(${new Date(upcomingBus[1]).toTimeString().substring(0, 5)})` : ''}
                        </span>
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

function TableSchedule({ upcomingBus, screenSize, testMode, testTime, getTimeDiff }: TableScheduleProps): JSX.Element {
  const now = testMode ? new Date(parseTime(testTime)) : new Date()

  /** 시간 차이에 따른 메시지와 스타일을 반환하는 함수 */
  const getTimeMessage = (departureTime: Date, stationLeadTime: number) => {
    // 버스 출발 시간 + 정류장까지의 소요 시간
    const stationTime = new Date(departureTime)
    stationTime.setMinutes(stationTime.getMinutes() + stationLeadTime)

    // 현재 시간과의 차이 계산 (분 단위)
    const diffInMinutes = Math.round((stationTime.getTime() - now.getTime()) / 60000)

    if (diffInMinutes < 0) {
      // 과거 시간 (이미 지난 정류장)
      const absDiff = Math.abs(diffInMinutes)
      if (absDiff < 1) {
        return { message: '조금전 출발', style: 'text-gray-500 dark:text-gray-400' }
      }
      return { message: `${absDiff}분전 출발`, style: 'text-gray-500 dark:text-gray-400' }
    } else if (diffInMinutes === 0) {
      // 현재 시간 (버스가 현재 이 정류장에 있음)
      return { message: '지금 여기', style: 'text-blue-500 dark:text-blue-400 font-bold' }
    } else {
      // 미래 시간 (아직 도착하지 않은 정류장)
      return { message: `${diffInMinutes}분 뒤`, style: 'text-red-500 dark:text-rose-500' }
    }
  }

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
                  const { message, style } = getTimeMessage(bus, station.leadTime)

                  return (
                    <td key={i} className={`md:px6 w-[26%] border px-1 py-2 text-center text-[15px] sm:text-sm md:w-[20%] md:text-base ${[3].includes(i) && screenSize < 768 && 'hidden'}`}>
                      <span className={style}>{message}</span>
                      <br />
                      <p className="flex w-full place-content-center text-[13px] text-gray-500 dark:text-gray-400 sm:text-sm md:text-[15px]">
                        ({busArrivalTime.toTimeString().substring(0, 5)}
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

/** 정류장 이름과 종점에서부터의 소요시간 */
const stations: Station[] = [
  { name: '하얏트호텔(기점)', str1: '하얏트', str2: '기점출발', leadTime: 0 },
  { name: '필리핀대사관', str1: '필리핀', str2: '대사관', leadTime: 1 },
  { name: '가야랑앞', leadTime: 2 },
  { name: '디지텍고등학교', str1: '디지텍', str2: '고등학교', leadTime: 3, highlight: true },
  { name: '성도약국', leadTime: 4, highlight: true },
  { name: '시장', leadTime: 4 }
]
