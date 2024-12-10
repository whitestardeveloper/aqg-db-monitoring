import { initializeApp } from 'firebase/app';
import { getDatabase, limitToFirst, onValue, orderByChild, query, ref, startAt } from "firebase/database";
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import '../App.css';
import Filters from '../Filters';
import { useLocation } from 'react-router-dom';
import { Pagination, Stack } from '@mui/material';
import { firebaseConfig } from '../utils';


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


    console.log(vals)
    setPage(1)
    setItems(vals)

  }, [loc.search])


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

      Object.entries(data).forEach(([key, item]: [string, any]) => {
        arr_updated.push({ ...item, key: key })
      });

      if (data !== null) {
        let vals = arr_updated;
        vals = vals.sort((prev: any, next: any) => prev.index - next.index)
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
