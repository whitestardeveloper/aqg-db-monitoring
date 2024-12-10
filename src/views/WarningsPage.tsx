import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { ref, onValue, set, orderByChild, query, limitToFirst, startAt } from "firebase/database";
import { orderBy, limit } from "firebase/firestore";
import { firebaseConfig, isWarningIncludes } from '../utils';


// var firebaseConfig = {
//   authDomain: "automatic-question-creato.firebaseapp.com",
//   databaseURL: "https://automatic-question-creator-default-rtdb.firebaseio.com",
//   projectId: "automatic-question-creator",
//   storageBucket: "automatic-question-creator.appspot.com",
// };

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const dbRef = ref(database, 'generated-question-list');
// const targetTef = ref(database, 'question-generation-pool');

const dbQuery = query(dbRef, orderByChild('index'), startAt(1), limitToFirst(7560));


function WarningsPage() {

  const [items, setItems] = useState([]);
  const [warningIndex, setWarningIndex] = useState<number[]>([]);


  useEffect(() => {
    onValue(dbQuery, (snapshot) => {
      const data = snapshot.val();

      // // Mevcut indexlerin listesini oluşturun
      // const existingIndexes: number[] = [/* Veritabanından alınan mevcut indexleri buraya ekleyin */];

      // 1'den 7560'a kadar tüm indexleri içeren bir dizi oluşturun
      const fullIndexList = Array.from({ length: 7560 }, (_, i) => i + 1);
      const allIndices = new Set(fullIndexList);

      // Eksik indexleri bulun


      Object.entries(data).forEach(([key, item]: [string, any]) => {
        const index = parseInt(key.split('-')[1]); // İndeks kısmını çıkar
        if (!isNaN(index) && index >= 1 && index <= 7560) {
          allIndices.delete(index);
        }
      });

      console.log(Array.from(allIndices.values()));
      setWarningIndex(Array.from(allIndices.values()));


      // if (data !== null) {
      //   let vals = arr_updated;
      //   vals = vals.sort((prev: any, next: any) => prev.index - next.index)

      //   let warningIndexex: number[] = []
      //   vals.forEach((v) => {
      //     if (isWarningIncludes(v?.data?.generated_text)) {
      //       warningIndexex.push(v.index)
      //     }
      //   });
      //   console.log(warningIndexex)
      //   setWarningIndex(warningIndexex)

      //   setItems(vals as any);
      // }
    });
  }, []);


  return (
    <>
      <div style={{ padding: 10, display: 'flex', flexWrap: 'wrap', maxWidth: 'calc(100vw - 20px)' }}>
        {warningIndex?.join(', ')}
      </div>

      <div style={{ margin: '10px auto' }}>
        {`${warningIndex.length} adet değişmesi gereken soru saptandı!!!`}
      </div>

      <div className="App">
        {/* <DataMigration sourceCollection={dbRef} targetCollection={targetTef} db={database} items={items} /> */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((i: any, queryIndex) => (
              <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                {/* <b style={{ color: '#d3489fa5', width: 60 }}>{`${queryIndex + 1}`}</b> */}
                <b style={{ color: 'orange', width: 60 }}>{`${i?.index}`}</b>

                {/* <b style={{ color: 'green', width: 30 }}>{i?.repeated_recording > 0 ? i?.repeated_recording : ''}</b> */}
                {/* <b style={{ color: 'purple', margin: '5px 0' }}>{i.key}</b> */}
                <u style={{ color: 'red', maxWidth: 100, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', }} >{i?.data?.generation_model}</u>
                <div style={{ overflow: 'hidden', maxWidth: 1000, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i?.data?.generated_text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default WarningsPage;

