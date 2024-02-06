// import ReactDOM from 'react-dom'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import _ from 'lodash'
import { formatDate } from 'utils/dateUtils'
import Layout from '/components/layout'
import Image from 'next/image'

export default function YongsanBus() {
  const [startTime, setStartTime] = useState(5) // 첫 버스가 출발하는 시간: 오전 5시
  const [busTimeTable, setBusTimeTable] = useState([])
  const [busTimeList, setBusTimeList] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const [upcomingBus, setUpcomingBus] = useState([])
  const [leftTime, setLeftTime] = useState({})

  useEffect(() => {
    // localStorage.theme = 'light'
    // const d = new Date(parseTime('21:30')) // d = 현재시간
    // setCurrentTime(d)

    const timeTable = []
    const timeStringList = []
    let timeHolder = []
    let minuteHolder = []

    for (let i = 0; i < yongsan.length; i++) {
      for (let j = 0; j < yongsan[i].length; j++) {
        let timeItem = formatTime(i + startTime, yongsan[i][j]) // format: (1) AM, PM (2) 10분 이하 Minutes
        timeStringList.push(formatTimeString(i + startTime, yongsan[i][j])) // init entire timeStringList
        timeHolder.push(timeItem) // timeTable의 'list' 생성을 위한 1회용 "time" 데이터 holder
        minuteHolder.push(`${yongsan[i][j]}`) // timeTable 'minutes' 생성을 위한 1회용 "minutes" 데이터 holder
      }
      timeTable.push({ hour: i + startTime, minutes: minuteHolder, list: timeHolder }) // push timeStringList, minuteList into timeTable
      timeHolder = []
      minuteHolder = []
    }
    console.log('timeStringList', timeStringList)

    setBusTimeTable(timeTable)
    setBusTimeList(timeStringList)
    // initTimeData()
  }, [])

  useEffect(() => {
    findNextBus() // busTimeTable과 busTimeList 로딩이 완료되면 findNextBus() 함수 실행
  }, [busTimeTable, busTimeList])

  useEffect(() => {
    if (upcomingBus === {}) return
    const now = new Date()
    // const now = new Date(parseTime('21:30'))
    const bus1 = new Date(upcomingBus.bus1)
    const bus2 = new Date(upcomingBus.bus2)

    setLeftTime({ bus1: getTimeDiff(now, bus1), bus2: getTimeDiff(now, bus2) })
  }, [upcomingBus])

  /** 화면에 보여지는 현재시간을 가져옴 */
  function initTimeData() {
    // console.log('new Date', new Date())
    // const sampleTime = parseTime('21:30')
    // let t = new Date(sampleTime).toTimeString().substring(0, 8)
    let t = new Date().toTimeString().substring(0, 8)
    setCurrentTime(t)
    findNextBus() // 다시 켜야함
    // onetimeFind()
  }

  /** 1초마다 현재시간 새로고침 */
  setInterval(initTimeData, 1000)

  // function onetimeFind() {
  //   if (busTimeTable.length === 0 || busTimeList.length === 0) return // busTimeTable 또는 busTimeList가 아직 생성되지 않았다면 break. 문제없는 경우 아래 코드로 계속 진행함
  //   // const d = new Date() // d = 현재시간
  //   const d = new Date(parseTime('21:30')) // d = 현재시간

  //   const nextBusIndex = busTimeList.findIndex((time) => new Date(parseTime(time)).valueOf() > d.valueOf())
  //   console.log('nextBusIndex', nextBusIndex)
  //   console.log(`Next Bus1 Time: ${busTimeList[nextBusIndex]} (Index #: ${nextBusIndex})`)
  //   console.log(`Next Bus2 Time: ${busTimeList[nextBusIndex + 1]} (Index #: ${nextBusIndex + 1})`)

  //   // setUpcomingBus({ bus1: stringToTime(busTimeList[nextBusIndex]), bus2: stringToTime(busTimeList[nextBusIndex + 1]) })
  // }

  /** 다음 버스가 언제 출발하는지 리턴해주는 함수 */
  function findNextBus() {
    if (busTimeTable.length === 0 || busTimeList.length === 0) return // busTimeTable 또는 busTimeList가 아직 생성되지 않았다면 break. 문제없는 경우 아래 코드로 계속 진행함
    const d = new Date() // d = 현재시간
    // const d = new Date(parseTime('21:30')) // d = 임의의 시간

    /**
     * 핵심: Date.prototype.valueOf()를 사용하여 Date -> Numerical value로 변환해줌.
     *
     * The valueOf() method of Date instances returns the number of milliseconds for this date since the epoch,
     * which is defined as the midnight at the beginning of January 1, 1970, UTC.
     *
     * ex) new Date(time1).valueOf() === new Date(time1).valueOf()
     * ex) new Date(time2).valueOf() > new Date(time1).valueOf() (date1이 date2보다 이전임. 그러면 valueOf() 값이 더 적음
     *
     * busTimeList에서 다음에 출발할 버스의 인덱스를 찾아주면 된다.
     * 그래서 현재시간.valueOf() 다음으로 큰 valueOf()의 첫번째 인덱스를 찾아주면 된다.
     * (i.e. 출발할 버스 중에서 현재시간으로부터 가장 가까운 버스의 인덱스를 찾아줌)
     */
    const nextBusIndex = busTimeList.findIndex((time) => new Date(parseTime(time)).valueOf() > d.valueOf())
    // console.log('nextBusIndex', nextBusIndex)
    // console.log(`Next Bus Time: ${busTimeList[nextBusIndex]} (Index #: ${nextBusIndex})`)
    // setUpcomingBus({ bus1: stringToTime(busTimeList[nextBusIndex]), bus2: stringToTime(busTimeList[nextBusIndex + 1]) })

    let arr = []
    for (let i = 0; i < 5; i++) {
      arr.push(stringToTime(busTimeList[nextBusIndex + i]))
    }
    // setUpcomingBus([stringToTime(busTimeList[nextBusIndex]), stringToTime(busTimeList[nextBusIndex + 1])])
    setUpcomingBus(arr)
  }

  // console.log('getTimeDiff(currentTime, upcomingBus[0])', getTimeDiff(stringToTime(currentTime), upcomingBus[0]))
  // console.log('currentTime', currentTime)
  // console.log('upcomingBus', upcomingBus)
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
            <div className="flex h-full w-full flex-col place-content-center items-center space-y-8 bg-[#1DB807] px-[10vw] pb-8 pt-16 dark:bg-slate-800">
              {/* <p className="mx-auto py-2 text-2xl font-semibold md:py-4 md:text-4xl">용산03 시간표</p> */}
              <div className="mt-4 rounded-md bg-[#E8F9E8] px-4 py-4 md:mt-8">
                <Image alt="용산03" src="/icon/yongsan_light.svg" width={0} height={0} sizes="100vw" className="justify-cente w-[480px]" />
              </div>
              {/* <Image alt="용산03" src="/icon/yongsan_white.svg" width={0} height={0} sizes="100vw" className="w-[360px] justify-center" /> */}

              <main className="mx-auto flex w-full flex-col place-content-center items-center pt-2 text-base text-white md:pt-4 md:text-2xl">
                <div className="flex place-content-center items-center space-x-6 md:space-x-16">
                  {/* <div className="flex w-fit flex-col place-content-center items-center">
                    <p>현재시간</p>
                    <p>{currentTime}</p>
                  </div> */}
                  <div className="flex w-fit text-center font-bold">
                    <p className="text-[#E8F9E8]">
                      다음 하얏트 출발
                      <br />
                      <span className="text-white">
                        {getTimeDiff(stringToTime(currentTime), upcomingBus[0])}분 후 <span className="text-sm md:text-lg">({new Date(upcomingBus[0]).toTimeString().substring(0, 5)})</span>
                      </span>
                    </p>
                  </div>
                  <div className="flex w-fit text-center font-bold">
                    <p className="text-[#E5F8E2]">
                      그 다음 하얏트 출발
                      <br />
                      <span className="text-white">
                        {getTimeDiff(stringToTime(currentTime), upcomingBus[1])}분 후 <span className="text-sm md:text-lg">({new Date(upcomingBus[1]).toTimeString().substring(0, 5)})</span>
                      </span>
                    </p>
                  </div>
                </div>
              </main>
            </div>
            <div className="mx-auto w-screen px-[6vw] py-16 dark:bg-slate-600 md:px-[20vw]">
              <div className="mx-auto flex w-full flex-col place-content-center items-center text-center text-xl font-bold md:text-3xl">
                용산03 도착정보
                <br />
                <span className="pt-2 text-lg text-blue-500 dark:text-blue-300 md:text-xl">(현재시간 {currentTime})</span>
              </div>
              <div className="mx-auto pt-8">
                <p className="pb-2 text-xs font-semibold md:text-sm">
                  하얏트호텔 → 남영 방향입니다. (경리단길 하행선 전용 시간표)
                  {/* <br />* 이 시간표는 용산03 공식 출발 시간표를 기준으로 제작되었습니다. */}
                </p>
                <TableSchedule upcomingBus={upcomingBus} />
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

function TableSchedule({ upcomingBus }) {
  // const now = new Date(parseTime('21:30'))
  const now = new Date()

  return (
    <>
      <table className="h-full w-[100%] table-fixed divide-y divide-gray-200 rounded dark:divide-gray-700">
        {/* <DashboardHeader />
        <DashboardBody upcomingBus={upcomingBus} /> */}
        <thead className="bg-gray-200/70 bg-white text-xs font-bold dark:bg-slate-900 md:text-base">
          <tr>
            {stations.map((station, i) => {
              return (
                <th key={i} scope="col" className={`w-[20%] px-1 py-2 text-left text-center rtl:text-right dark:text-white md:pl-10 md:pr-4 ${[2, 3].includes(i) && ''}`}>
                  {station.str1 ? (
                    <>
                      <p className={`text-[12px] md:text-base ${[2, 3].includes(i) ? '' : ''}`}>
                        {station.str1} <br /> {station.str2}
                      </p>
                    </>
                  ) : (
                    station.name
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {/* <td className="w-[20%] py-3.5 pl-6 pr-4 text-sm font-medium text-gray-700">다음 버스 도착</td> */}
          {upcomingBus.map((bus, i) => {
            return (
              <tr key={`row${i}`} className="hover:bg-slate-50 dark:hover:bg-slate-600">
                {stations.map((station, i) => {
                  let busArrivalTime = addMinutes(new Date(bus), station.leadTime) // 다음 버스 출발시간 + 각 정류장까지 도달하는 시간(leadTime)을 더해줌
                  return (
                    <td key={i} className={`w-[20%] px-1 py-2.5 text-center text-xs text-red-600 dark:text-red-500 md:pl-10 md:pr-4 md:text-[15px] ${[2, 3].includes(i) && ''}`}>
                      {getTimeDiff(now, bus) + station.leadTime}분 뒤<br />
                      {/*  */}
                      <p className="flex w-full place-content-center text-[12px] text-gray-500 dark:text-gray-300 md:text-sm">
                        ({shortenTime(busArrivalTime)}
                        <span className="hidden md:block">&nbsp;도착</span>)
                      </p>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

// const DashboardHeader = () => {
//   return (
//     <>
//       <thead className="text-xm bg-white font-bold dark:bg-gray-800 md:text-base">
//         <tr>
//           {stations.map((station, i) => {
//             return (
//               <th key={i} scope="col" className={`w-[20%] px-1 py-3.5 text-left text-center rtl:text-right dark:text-gray-400 md:pl-10 md:pr-4 ${[2, 3].includes(i) ? 'text-red-700 ' : 'text-gray-700'}`}>
//                 {station.name}
//               </th>
//             )
//           })}
//         </tr>
//       </thead>
//     </>
//   )
// }

// const DashboardBody = ({ upcomingBus }) => {
//   // const now = new Date(parseTime('21:30'))
//   const now = new Date()

//   if (upcomingBus.length > 0) {
//     return (
//       <>
//         {/* even:bg-slate-50 */}
//         <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
//           {/* <td className="w-[20%] py-3.5 pl-6 pr-4 text-sm font-medium text-gray-700">다음 버스 도착</td> */}
//           {upcomingBus.map((bus, i) => {
//             return (
//               <tr key={`row${i}`} className="hover:bg-slate-50 ">
//                 {stations.map((station, i) => {
//                   let busArrivalTime = addMinutes(new Date(bus), station.leadTime) // 다음 버스 출발시간 + 각 정류장까지 도달하는 시간(leadTime)을 더해줌
//                   return (
//                     <td key={i} className="w-[20%] truncate px-1 py-2.5 text-center text-sm text-gray-500 dark:text-gray-300 md:pl-10 md:pr-4">
//                       {getTimeDiff(now, bus) + station.leadTime}분 후 <br /> ({shortenTime(busArrivalTime)})
//                     </td>
//                   )
//                 })}
//               </tr>
//             )
//           })}
//         </tbody>
//       </>
//     )
//   }
// }

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

/**
 * stringToTime(time) -> formatTime(hour, minute) -> parseTime(formattedTime) -> 날짜형식 데이터 리턴받음
 * "10:50AM" -> "Mon Feb 05 2024 10:50:00 GMT+0900 (한국 표준시)" 처럼 String을 시간형식으로 리턴해줌 */
function stringToTime(time) {
  const targetIndex = time.indexOf(':')
  // console.log('targetIndex', targetIndex)
  if (targetIndex === 1) {
    // 시간이 한자리인 경우. 예) 5:50
    return formatTime(time.substring(0, 1), time.substring(2))
  } else {
    // 시간이 두자리인 경우
    return formatTime(time.substring(0, 2), time.substring(3))
  }
}

/** AM, PM 등 시간 포맷을 맞춰주고, String을 시간 형식으로 리턴해줌 */
function formatTime(hour, minute) {
  let formattedTime
  if (hour < 12) {
    formattedTime = minute < 10 ? `${hour}:0${minute}AM` : `${hour}:${minute}AM`
  } else {
    formattedTime = minute < 10 ? `${hour}:0${minute}PM` : `${hour}:${minute}PM`
  }
  return parseTime(formattedTime)
}

/** 문자열 "10:30" 시간을 -> 날짜 데이터 리턴해줌 */
function parseTime(timeString) {
  if (timeString == '') return null

  var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i)
  if (time == null) return null

  var hours = parseInt(time[1], 10)
  if (hours == 12 && !time[4]) {
    hours = 0
  } else {
    hours += hours < 12 && time[4] ? 12 : 0
  }
  var d = new Date()
  d.setHours(hours)
  d.setMinutes(parseInt(time[3], 10) || 0)
  d.setSeconds(0, 0)
  return d
}

/**
 * 예: 17:5 -> 17:05로 리턴해줌
 * 17:5이면 날짜 변환이 안되서 format을 맞춰준다
 * */
function formatTimeString(hour, minute) {
  // console.log('formatTimeString', minute < 10 ? `${hour}:0${minute}` : `${hour}:${minute}`)
  return minute < 10 ? `${hour}:0${minute}` : `${hour}:${minute}`
}

/** 두 시간의 차이를 계산하는 함수 */
function getTimeDiff(date1, date2) {
  // const d1 = date1 === 'now' ? new Date().getTime() : new Date(date1).getTime()
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  return Math.round((d2 - d1) / 60000) // Can use Math.floor or Math.ceil depends up to you
}

/** 용산03 버스시간표. 0번째 인덱스는 새벽 5시. */
const yongsan = [
  [50, 57], // 5시
  [4, 11, 18, 26, 34, 42, 50, 58], // 6시
  [6, 14, 22, 30, 38, 47, 56], // 7시
  [5, 14, 23, 32, 41, 50, 59], // 8시
  [8, 17, 26, 35, 44, 53], // 9시
  [2, 10, 18, 26, 34, 43, 52], // 10시
  [1, 10, 19, 28, 37, 46, 55], // 11시
  [4, 13, 22, 30, 39, 48, 57], // 12시
  [6, 15, 24, 33, 42, 51], // 13시
  [0, 9, 18, 27, 36, 45, 54], // 14시
  [3, 12, 21, 30, 39, 48, 57], // 15시
  [6, 16, 26, 36, 46, 56], // 16시
  [6, 16, 26, 36, 46, 57], // 17시
  [8, 19, 30, 41, 52], // 18시
  [3, 14, 15, 36, 46, 58], // 19시
  [10, 22, 34, 46, 58], // 20시
  [10, 22, 34, 43, 51, 59], // 21시
  [7, 15, 23, 31, 39, 47, 55], // 22시
  [3, 12] // 23시
]

/** 정류장 이름과 종점에서부터의 소요시간 */
const stations = [
  //   { name: '하얏트호텔', leadTime: 0 },
  { name: '필리핀대사관', str1: '필리핀', str2: '대사관', leadTime: 1 },
  { name: '가야랑앞', leadTime: 2 },
  { name: '디지텍고등학교', str1: '디지텍', str2: '고등학교', leadTime: 3, highlight: true },
  { name: '성도약국', leadTime: 4, highlight: true },
  { name: '시장', leadTime: 4 }
]

// function BusStation({ upcomingBus, leftTime }) {
//   //   console.log('upcomingBus', new Date(upcomingBus.bus1))
//   const newDateObj = addMinutes(new Date(upcomingBus.bus1), leftTime.bus1)
//   //   console.log('newDateObj', newDateObj)
//   return (
//     <>
//       <div className="mx-auto flex w-full place-content-center space-x-8 pt-12 text-sm md:space-x-16 md:text-xl">
//         <div className="flex w-fit flex-col text-center">
//           <div className="pb-8 font-bold">정류장</div>
//           {stations.map((station, i) => {
//             return (
//               <div key={i} className={`pb-8 ${station.highlight && 'font-bold'}`}>
//                 {station.name}
//               </div>
//             )
//           })}
//         </div>
//         <div className="flex w-fit flex-col text-center">
//           <div className="pb-8 font-bold">다음 버스 도착</div>
//           {stations.map((station, i) => {
//             let busArrivalTime = addMinutes(new Date(upcomingBus.bus1), station.leadTime) // 다음 버스 출발시간 + 각 정류장까지 도달하는 시간(leadTime)을 더해줌
//             return (
//               <div key={i} className={`pb-8 ${station.highlight && 'font-bold text-red-500'}`}>
//                 {leftTime.bus1 + station.leadTime}분 후 ({shortenTime(busArrivalTime)})
//               </div>
//             )
//           })}
//         </div>
//         <div className="flex w-fit flex-col text-center">
//           <div className="pb-8 font-bold">그 다음 버스 도착</div>
//           {stations.map((station, i) => {
//             let busArrivalTime = addMinutes(new Date(upcomingBus.bus2), station.leadTime) // 다음 버스 출발시간 + 각 정류장까지 도달하는 시간(leadTime)을 더해줌
//             return (
//               <div key={i} className={`pb-8 ${station.highlight && 'font-bold'}`}>
//                 {leftTime.bus2 + station.leadTime}분 후 ({shortenTime(busArrivalTime)})
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </>
//   )
// }
