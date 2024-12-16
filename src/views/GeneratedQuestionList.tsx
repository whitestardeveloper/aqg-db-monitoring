import { initializeApp } from 'firebase/app';
import { getDatabase, limitToFirst, onValue, orderByChild, query, ref, startAt } from "firebase/database";
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import '../App.css';
import Filters from '../Filters';
import { useLocation } from 'react-router-dom';
import { Pagination, Stack } from '@mui/material';
import { firebaseConfig, getJsonArrayFromRaw } from '../utils';
const dJSON = require('dirty-json');


// Firebase uygulamasını başlatın
const app = initializeApp(firebaseConfig);

// Veritabanı referansını alın
const database = getDatabase(app);
const dbRef = ref(database, 'generated-question-list');
const dbQuery = query(dbRef, orderByChild('index'), startAt(1), limitToFirst(7560));

const allSourcesDataRef = ref(database, 'question-gen-sources');

const TAKE_ITEM_COUNT = 25;

function GeneradQuestionList() {
  const [items, setItems] = useState([]);
  const [allSourcesData, setAllSourcesData] = useState([]);
  const [page, setPage] = useState(1);

  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);


  useEffect(() => {

    let vals = items;

    const searchText = qs.get('searchText');
    const qType = qs.get('qType');
    const qDiffLevel = qs.get('qDiffLevel');
    const qModel = qs.get('qModel');
    const qClass = qs.get('qClass');
    const qCourse = qs.get('qCourse');
    const qCategory = qs.get('qCategory');


    vals = vals.filter((v: any) => (
      (!searchText || v?.data?.generated_text.includes(searchText)) &&
      (!qType || v?.questions_info?.question_type === qType) &&
      (!qDiffLevel || v?.questions_info?.question_difficulty_level === qDiffLevel) &&
      (!qModel || v?.data?.generation_model === qModel) &&
      (!qClass || v?.source_info?.class === qClass) &&
      (!qCourse || v?.source_info?.course === qCourse) &&
      (!qCategory || v?.source_info?.category === qCategory)
    ));


    // console.log(vals)
    setPage(1)
    setItems(vals)

  }, [loc.search])


  const getJsonArrayQuestion = (questionRawList: any) => {
    // Eğer questionRawList zaten bir dizi ya da nesne ise, string'e dönüştürmeye gerek yok
    // console.log(typeof questionRawList);

    // Eğer questionRawList bir stringse, onu işleyelim
    if (typeof questionRawList === "string") {
      // Gereksiz ` ```json ` ve ` ``` ` gibi karakterleri temizleyelim
      questionRawList = questionRawList
        .replace(/```json|```/g, '') // ```json ve ``` gibi kod bloklarını temizle
        .replace(/\n/g, '') // Satır sonu karakterlerini temizle
        .replace(/\r/g, '') // Windows carriage return'leri temizle
        .replace(/False/g, 'false') // Python tarzı False'u JS false'a çevir
        .replace(/True/g, 'true') // Python tarzı True'u JS true'a çevir
        .replace(/,(\s*[\]}])/g, '$1'); // Fazladan virgül varsa, temizle (örnek: "[1, 2,]" -> "[1, 2]")
    }

    // Eğer verimiz hala string'teyse, False/True'yu işleyelim
    let cleanedData = questionRawList.replace(/False/g, 'false').replace(/True/g, 'true');

    try {
      // JSON.parse işlemi ile geçerli bir JSON nesnesine dönüştürme

      // let parsedJson = dJSON.parse(cleanedData); ## with json-parse package
      let parsedJson = JSON.parse(cleanedData);


      // parsedJson'ın türünü kontrol et
      // console.log(typeof parsedJson);
      // console.log(JSON.stringify(parsedJson))

      // Eğer parsedJson bir dizi ise döndürelim, yoksa boş dizi dönelim
      return Array.isArray(parsedJson) ? parsedJson : [];
    } catch (error) {
      // console.error("JSON.parse hata:", error);
      return []; // JSON.parse hatası varsa boş dizi döndürelim
    }
  };


  useEffect(() => {

    //question sources get
    onValue(allSourcesDataRef, (snapshot) => {
      const data = snapshot.val();
      let arr_updated: any[] = [];

      Object.entries(data).forEach(([key, item]: [string, any]) => {
        arr_updated.push({ ...item, key: key })
      });

      if (data !== null) {
        let vals = arr_updated;
        vals = vals.sort((prev: any, next: any) => prev.index - next.index)
        setAllSourcesData(vals as any);
      }
    });

    //question list get
    onValue(dbQuery, (snapshot) => {
      const data = snapshot.val();
      let arr_updated: any[] = [];
      let q_list: any[] = [];


      let error_json_array_ids: string[] = [];

      Object.entries(data).forEach(([key, item]: [string, any]) => {
        arr_updated.push({ ...item, key: key })

        const arr = getJsonArrayQuestion(item?.data?.generated_questions);
        if (arr.length === 0) {
          error_json_array_ids.push(key)
        } else {
          q_list = q_list.concat(arr)
        }
        // q_list.push()
      });

      if (data !== null) {

        console.log(q_list.length)
        console.log(error_json_array_ids.length)
        console.log(error_json_array_ids)


        let vals = arr_updated;
        vals = vals.sort((prev: any, next: any) => prev.index - next.index)
        vals = vals.filter(v => error_json_array_ids.findIndex((e: any) => e === v.key) > -1)
        setItems(vals as any);
      }
    });
  }, []);



  return (
    <div className="App">
      {items.length > 0 && allSourcesData.length > 0 && <Filters />}
      {items.length > 0 && allSourcesData.length > 0 && <DataTable questionList={items.slice(TAKE_ITEM_COUNT * (page - 1), TAKE_ITEM_COUNT * page)} allSourcesData={allSourcesData} />}
      <Stack>
        <Pagination
          count={Math.ceil(items.length / TAKE_ITEM_COUNT)}
          variant="outlined"
          color="secondary"
          size="large"
          sx={{ my: 3, mx: 'auto' }}
          page={page}
          onChange={(event: React.ChangeEvent<unknown>, value: number) => setPage(value)}
        />
      </Stack>
    </div>
  );
}

export default GeneradQuestionList;
