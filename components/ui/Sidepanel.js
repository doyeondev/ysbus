import React, { Fragment, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { Loader } from '/components/clib/Loader.js'

// import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function SidePanel({ data, clickedItem, showSidebar, setShowSidebar }) {
  const [selectedClauses, setSelectedClauses] = useState([]) // 선택된 메모의 인덱스. 디폴트는 첫번째 메모로 지정함.
  const [showPreview, setShowPreview] = useState(false)
  const [fileLoadCompleted, setFileLoadCompleted] = useState(false)

  useEffect(() => {
    if (clickedItem && clickedItem.length > 0) {
      const updatedClauses = [...selectedClauses, parseInt(clickedItem.idx)]
      setSelectedClauses(updatedClauses)
      console.log('clickedItem', clickedItem)
      console.log('data', data)
    }
  }, [])

  useEffect(() => {
    console.log('updated selectedClauses : ', selectedClauses)
  }, [selectedClauses])

  useEffect(() => {
    console.log('showPreview State : ', showPreview)
    let docsFile = document.getElementById('googleDocs')
    if (docsFile) {
      document.getElementById('googleDocs').onload = function () {
        setFileLoadCompleted(true)
        // alert('myframe is loaded')
      }
    }
  }, [showPreview])

  // grid-cols-[240px_1fr_1.2fr]
  function clauseClickHandler(e) {
    // console.log('id', e.target.id)
    let selectedIdx = parseInt(e.target.id)

    // 이미 클릭되었었던 경우 => 빼준다
    if (selectedClauses.includes(selectedIdx)) {
      let updatedClauses = selectedClauses.filter((clause) => clause !== selectedIdx)
      setSelectedClauses(updatedClauses)
    }
    // 이전에 선택 안되었었던 조항의 경우 => 추가해준다
    else if (!selectedClauses.includes(selectedIdx)) {
      const updatedClauses = [...selectedClauses, selectedIdx]
      setSelectedClauses(updatedClauses)
    }
  }

  return (
    <div className="">
      {!showSidebar && (
        <div onClick={() => setShowSidebar(!showSidebar)} className="fixed right-0 top-1/3 z-30 flex h-16 w-5 cursor-pointer items-center rounded-l-sm border border-gray-400 bg-gray-100/50 delay-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      <div className={`-pl-20 fixed right-0 top-0 z-40 grid h-full w-full grid-cols-[1fr_auto] duration-300 ease-in-out ${showSidebar === true ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`h-full w-full bg-black opacity-100 ${showPreview === true ? 'opacity-100' : 'opacity-50'}`}>
          {showPreview === true && (
            <div className="h-full w-full">
              {/* <div className="flex h-full w-full place-content-center items-center justify-center bg-white text-sm">
                <Loader />
              </div> */}
              {/* <p className="place-content-center items-center justify-center">.</p> */}
              {/* <Loader /> */}

              {fileLoadCompleted === false && <Loader />}
              {/* {fileLoadCompleted === false ? (
                <Loader />
              ) : (
                <iframe id="googleDocs" className="h-full w-full" src="https://docs.google.com/document/d/1PwNpbPDyDmcHfhMELD2uXWnuNMqXJZQm/edit?usp=drive_link&ouid=117883175460632990179&rtpof=true&sd=true"></iframe>
              )} */}
              {/* <iframe className="h-full w-full" src="https://docs.google.com/document/d/e/2PACX-1vTNbu-unR1KWypFy4l0WkhNr4WtCzUjDw6A2HVuhRMkRifdRELEm5MJpwaYqMFv8R-i2xLXyvOhc5Ul/pub?embedded=true"></iframe> */}
              {/* <iframe className="h-full w-full" src="https://docs.google.com/document/d/e/2PACX-1vTNbu-unR1KWypFy4l0WkhNr4WtCzUjDw6A2HVuhRMkRifdRELEm5MJpwaYqMFv8R-i2xLXyvOhc5Ul/pub?embedded=true"></iframe> */}
              {/* <iframe className="h-full w-full" src="https://docs.google.com/document/d/e/2PACX-1vTNbu-unR1KWypFy4l0WkhNr4WtCzUjDw6A2HVuhRMkRifdRELEm5MJpwaYqMFv8R-i2xLXyvOhc5Ul/pub?embedded=true"></iframe> */}

              {/* https://docs.google.com/document/d/1wvZFqGmbx5gb-8dUAsquZNzfLpsV_GJA/edit?usp=drive_link&ouid=117883175460632990179&rtpof=true&sd=true */}
              {/* <iframe className="h-full w-full" src="https://docs.google.com/document/d/1BmhCURw16_5yJnHJzB6Z7pvPS9e_3-GoJo3gJFYwlO0/edit?embedded=true&rm=demo"></iframe> */}
              {/* <Preview /> */}
              <iframe id="googleDocs" className="h-full w-full" src="https://docs.google.com/document/d/1PwNpbPDyDmcHfhMELD2uXWnuNMqXJZQm/edit?usp=drive_link&ouid=117883175460632990179&rtpof=true&sd=true"></iframe>

              {/* <iframe id="googleDocs" className="h-full w-full" src="https://docs.google.com/document/d/1PwNpbPDyDmcHfhMELD2uXWnuNMqXJZQm/edit?usp=drive_link&ouid=117883175460632990179&rtpof=true&sd=true"></iframe> */}
            </div>
          )}
        </div>

        {/* panel start */}
        <div className="ml-auto flex w-[640px] flex-col overflow-scroll bg-gray-100 px-12 py-8">
          {/* <div onClick={() => setShowSidebar(!showSidebar)} className="h-[32px] w-full"></div> */}
          <Heading showSidebar={showSidebar} setShowSidebar={setShowSidebar} showPreview={showPreview} setShowPreview={setShowPreview} />
          {/* <div className="mb-24 flex h-full place-content-center items-center p-4 text-gray-400">아직 답변한 질문이 없어요</div> */}
          <div className="bg-white">
            {/* <main className="mx-auto w-[960px] py-6"> */}
            <main className="mx-auto w-full">
              <div className="flex w-full flex-col border-b border-dotted border-gray-300 px-8 py-6 text-sm">
                <div className="flex items-center py-2">
                  <div className="text-lg font-bold">{data.contractName}</div>
                  <div className="ml-4 rounded bg-gray-200/50 px-1 py-0.5 text-xs text-gray-600 shadow-sm">{data.clientName}</div>
                </div>
                <div className="flex justify-between py-2">
                  <div className="flex flex-col">
                    <p className="text-gray-500">계약 당사자 (갑)</p>
                    <p className="mt-1 text-gray-700">{data.partyA}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500">계약 당사자 (을)</p>
                    <p className="mt-1 text-gray-700">{data.partyB}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500">산업</p>
                    <p className="mt-1 text-gray-700">{data.industry}</p>
                  </div>
                </div>
                <div className="my-2 h-[1px] w-full bg-slate-300"></div>
                <div className="flex flex-col py-2">
                  <p className="text-gray-500">계약의 목적</p>
                  <p className="mt-1 text-gray-700">{data.purpose}</p>
                </div>
              </div>
            </main>
            <div className="mx-auto w-full py-6">
              <div className="flex flex-wrap place-content-center gap-4 px-8">
                {data['clauseArray']?.map((clause) => {
                  // console.log('clause.idx', clause.idx, selectedClauses)
                  // console.log('selectedClauses.includes(clause.idx)', selectedClauses.includes(clause.idx))
                  return (
                    <div
                      onClick={function (e) {
                        clauseClickHandler(e)
                      }}
                      id={clause.idx}
                      key={clause.idx}
                      className={`cursor-pointer rounded border border-slate-600 px-3 py-1 text-xs font-medium ${selectedClauses.includes(clause.idx) === true ? 'bg-gray-800 text-white shadow-sm' : 'bg-white'}`}
                    >
                      제{clause.idx}조 {clause.text}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mx-auto w-full py-6">
              {data['contentArray']?.map((clause, idx) => {
                if (selectedClauses.includes(idx) === true) {
                  console.log('clause', clause)
                  // let clauseTitle = sampleData[idx].filter((data) => data.tag === 'h2').text
                  // const selectedItem =
                  const article = clause.filter((x) => x.tag === 'h2')[0] // 첫 번째 h2여서 '0'
                  const contentList = clause.filter((x) => x.tag !== 'h2')
                  let CONTENT_HTML = ''
                  for (let i = 0; i < contentList.length; i++) {
                    CONTENT_HTML = CONTENT_HTML.concat(contentList[i].html)
                  }
                  console.log('article', article)
                  console.log('CONTENT_HTML', CONTENT_HTML)
                  return (
                    <>
                      <div className="clauseCard mb-8 flex flex-col px-8">
                        <h3 className="mb-1 font-bold">
                          제{article.idx}조 {article.text}
                        </h3>
                        <div style={{ color: 'black' }} className="text-xs leading-5" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}></div>
                      </div>
                    </>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Heading = ({ showSidebar, setShowSidebar, showPreview, setShowPreview }) => {
  return (
    <div className="flex items-center justify-between pb-4">
      {/* <div className="flex-grow">
        <p className="text-justify text-xl font-bold leading-relaxed">내 답변 한 눈에 확인하기 ✅ </p>
      </div> */}
      <button onClick={() => setShowPreview(!showPreview)} className="rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white">
        계약서 원문보기
      </button>
      <div onClick={() => setShowSidebar(!showSidebar)} className="bg-white-100 ml-auto flex h-7 w-7 flex-shrink-0  cursor-pointer flex-row-reverse items-center justify-center rounded-full text-black">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}

const Preview = () => {
  return (
    // <div id="google-doc-container" className="absolute bottom-4 left-4 right-4 top-4 h-full w-full bg-[#eeeeee]">
    //   <div class="absolute h-full w-full origin-top-left bg-[#ffffff] shadow-sm transition delay-150 ease-in-out">
    //     <iframe src="https://docs.google.com/document/d/e/2PACX-1vTNbu-unR1KWypFy4l0WkhNr4WtCzUjDw6A2HVuhRMkRifdRELEm5MJpwaYqMFv8R-i2xLXyvOhc5Ul/pub?embedded=true"></iframe>
    //   </div>
    // </div>
    // <div id="google-doc-container">
    //   <div className="google-doc">
    //     <iframe src="https://docs.google.com/document/d/e/2PACX-1vTNbu-unR1KWypFy4l0WkhNr4WtCzUjDw6A2HVuhRMkRifdRELEm5MJpwaYqMFv8R-i2xLXyvOhc5Ul/pub?embedded=true"></iframe>
    //   </div>
    // </div>
    <></>
  )
}

// body{
//     background-color: #eee;
//       #google-doc-container{
//           position: absolute;
//           background-color: #eee;
//           left:   16px;
//           top:    16px;
//           right:  16px;
//           bottom: 16px;
//           .google-doc {
//               position: absolute;
//               width: 826px;
//               height: 1066px;
//               background-color: #fff;
//               transform-origin: top left;
//               transition: all 100ms ease-in-out !important;
//               box-shadow: 0px 6px 15px 0px rgba(0,0,0,0.32);
//               &:after {
//                   position: absolute;
//                   bottom: 0;
//                   width: 100%;
//                   height: 256px;
//                   background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 93%,rgba(255,255,255,1) 100%);
//                   content: "";
//               }
//               iframe {
//                   border: 0;
//                   width: 826px;
//                   height: 1066px;
//               }
//           }
//       }
//   }
