import React, { useEffect, useState } from 'react';
import './App.css';
import useSWR from 'swr';
import DataTable from './DataTable';
import { initializeApp } from 'firebase/app';
import { get, getDatabase } from "firebase/database";
import { ref, onValue, set, orderByChild, query, limitToFirst, startAt } from "firebase/database";
import { orderBy, limit, where } from "firebase/firestore";
import DataMigration from './components/DataMigration';
import { isWarningIncludes } from './utils';



// "type": "service_account",
// "project_id": "automatic-question-creator",
// "private_key_id": "83dfa70fbba634d28c4d67d2924366ea552fa8e3",
// "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDctTA1b4RM0Ks\nW0Ja/14Ris+w3sCK3csSRjU+3TQBZD9qtWg2Q2x/y3+gYdQ9jtir+uaIEnltPevW\n+t81Y2BSG9FBpDzCCzpQcgbJXkgJNMG0sJR6GAJI2Zsn34onAOkmeWWyc0PQP4So\nOmUIB36ha6j9yNa9a0QnCsOr/fFRhJrTpGxRqd4jhnbrLgcxskEmxNxCw2U9nIeK\nfUXXaEjHxbXqHEE1f+uEznxb/xmexzjexjoy/u7rcVlILjmkX5lnMlG18Xyj2MRs\n+e5iP1YbuHnwL3eCQ9YylXQYqrdMm3G6qYtJ/xIzq+5WXH6dHKFxyBpiroj4kcSo\n0TVRX3RbAgMBAAECggEAD+KxcCBEm9lIE1eHg9CQW2n7iitQsvi78fb1ikUoXkSW\nSEdeT6rDPXp+G7xX0nkIcKdVPWdi/yyykn0+zx64oXPUBOXNxRJsjEVNpT2d1UG4\nd3CIC4m6sHkfUepVVujitQHWRjQgJY5EFfhJEJIAtNYEnOafWDNJDXNOhsLTw7BD\nF2KRp5yG8dTg9whrLHYRXDhePvahXSPnMKF3HVg/6Ef5IKl8G/kr0f/3n6AHNZg9\nAIng37E/qwsm+hrb13LeuLy0EZgn8CvI695/yHVdl1wxQpWP3iUM1mjqxl1gIq9x\n0i4yqRXVueF681fTlGmufIhRLXqHCJKgeuRbamwy4QKBgQDjgMeZI2F+GXP9ECBb\nTqnBxGKTZUgiOBJoSwC2uVylwLe8bim6Bfz6kxWC1U5kDPLnbqGuI/hjaXGSV5Gq\n2lma25vCJXELKDx99aYip8CXFRxvjCHEBLjjGiFTV57KvtavuX/R+uJ6qfSkelq2\nDCkSnnThN2bHu03OfwPuO0qsxQKBgQDb7i1S2gpqPi2C9ZSEoKaPS1w053/87dVF\nq59NfhFobs5W4ebDq9RVNJF8yCH+q87wUcIuK4DXLB/ZJG2fJZd64SmmZQtsZ6F6\nMgVAFX9qqVnxtvc4JnpWchTZFT2YF+GiNPBU7hITax+y+au2Ken/sTpXlbtEQyUn\nDCgYr9PunwKBgQCeA2Ee5Sse2XDtUNkYch+IHO3WsF8UnVtzoryBLWfDHILBVsaW\nlPgr1iL3t032QeQoiHe1qvgnnCIs4bOkNnpMC8I4a6cDd9PkLM1Sfq9OgHQ6qdr9\n+cWsvwZsi4wYB8q3TKER6C6LwiXQY8dDcFjKvNIzZzZ0/YxCI4hIXFg2fQKBgAYB\nxV8j8XDhbeDL0FinAqWbS1Nul0JTRKX4gAtfzB3sGNqqpODnSo9hNjAQT01jZ+2M\nbh9QtN4rqFsH8a6NGkwS5k5TKDK3yeNKhnYvoCFLqtc9RhdUhbbiussLF3mV/WWu\nyHmpXvkEzgLXauc40dlX/93wiwLcSqF8ZYP3GXTFAoGAXQcjLtO5luRNRN3hA05Y\nI9G5KdQqM8QpNUrDNig0czOSR74avChswksLbZkkJ6vgz6aC4/vRUXsQ1I1LaKo5\nhUDxrYBbSh1GjJFBFjk3iT+kGGZxIbjSZOXrULfi+igX5UXHrTIDjfZOLHG3uYnK\n/PrH2v+56LpIz2el7aftuQE=\n-----END PRIVATE KEY-----\n",
// "client_email": "firebase-adminsdk-17vd0@automatic-question-creator.iam.gserviceaccount.com",
// "client_id": "109682774411336424100",
// "auth_uri": "https://accounts.google.com/o/oauth2/auth",
// "token_uri": "https://oauth2.googleapis.com/token",
// "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-17vd0%40automatic-question-creator.iam.gserviceaccount.com",
// "universe_domain": "googleapis.com"



var firebaseConfig = {
  // apiKey: "API_KEY",
  authDomain: "automatic-question-creato.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://automatic-question-creator-default-rtdb.firebaseio.com",
  projectId: "automatic-question-creator",
  storageBucket: "automatic-question-creator.appspot.com",
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID",
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  // measurementId: "G-MEASUREMENT_ID",
};


// Firebase uygulamasını başlatın
const app = initializeApp(firebaseConfig);

// Veritabanı referansını alın
const database = getDatabase(app);
const dbRef = ref(database, 'generated-question-list');
const dbQuery = query(dbRef, orderByChild('index'), startAt(1), limitToFirst(20));


const allSourcesDataRef = ref(database, 'question-gen-sources');

// export const fetcher = async (url: string) => {
//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }

//   return response.json();
// };


function App() {
  // const baseUrl = 'https://automatic-question-creator-default-rtdb.firebaseio.com';
  // const { data } = useSWR(`${baseUrl}/generated-question-list.json?orderBy="index"&limitToFirst=10`, (url: string) => fetcher(url));
  // const { data: allSourcesData } = useSWR(`${baseUrl}/question-gen-sources.json`, (url: string) => fetcher(url));
  // data && console.log(Object.values(data).map(x => console.log(x)))

  const [items, setItems] = useState([]);
  const [allSourcesData, setAllSourcesData] = useState([]);



  // async function multiFilter(dataFilters: any) {
  //   // Dinamik Filtreleme: `dataFilters` nesnesine göre filtre uygula
  //   dataFilters.forEach((filter: any) => {
  //     data = data.filter((item) => item[filter.key] === filter.value);
  //   });

  // }


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
      {items.length > 0 && allSourcesData.length > 0 && <DataTable questionList={items} allSourcesData={allSourcesData} />}
    </div>
  );
}

export default App;
