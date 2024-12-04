import { Database, DatabaseReference } from 'firebase/database';
import "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, query, orderByChild, startAt, limitToFirst, remove } from "firebase/database";




type Props = {
    sourceCollection: any;
    targetCollection: any;
    items: any[];
    db: any;
};


export default function DataMigration({ sourceCollection, targetCollection, items, db }: Props) {
    const [isMigrating, setIsMigrating] = useState(false);
    const [message, setMessage] = useState("");
    const [targetList, setTargetList] = useState<string[]>([])
    
    

    // useEffect(() => {
    //   let tempList: string[] = []
    //   items.forEach(item => {
    //     if(item?.repeated_recording > 0)
    //       tempList.push(item.key)
    //   })
    //   setTargetList(tempList)
    // }, [items])

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const migrateData = async () => {
      const batchSize = 100;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
    
        for (const item of batch) {
          if (item?.repeated_recording > 0) {
            try {
              // Hedef veritabanına kayıt ekleme
              await set(ref(db, `question-generation-pool/${item.key}`), item);
    
              // Kayıt başarılı olduğunda source veritabanından silme
              await remove(ref(db, `generated-question-list/${item.key}`));
              console.log(`Item with key ${item.key} migrated and deleted from source.`);
            } catch (error) {
              console.error(`Error migrating item with key ${item.key}:`, error);
            }
          }
        }
    
        // Her batch sonrası bekleme süresi
        console.log(`Processed batch ${i / batchSize + 1}, waiting before next batch...`);
        await delay(100); // 1 saniye bekleme
      }
    };
    

    // const migrateData = async () => {
    //     setIsMigrating(true);
    //     setMessage("Starting data migration...");

    //     try {
    //         const batchSize = 500; // Aynı anda işlenecek belge sayısı

    //         for (const targetKey of targetList) {
    //             let lastDoc = null;

    //             while (true) {
    //                 let query = sourceCollection
    //                 .where("key", "==", targetKey)
    //                 .limit(batchSize);

    //                 if (lastDoc) {
    //                     query = query.startAfter(lastDoc);
    //                 }

    //                 const snapshot = await query.get();
    //                 if (snapshot.empty) {
    //                     break;
    //                 }

    //                 const batch = db.batch();

    //                 snapshot.forEach((doc: any) => {
    //                     const newDocRef = targetCollection.doc(doc.id); // Aynı belge ID'sini koruyarak taşıma
    //                     batch.set(newDocRef, doc.data());
    //                 });

    //                 await batch.commit();
    //                 lastDoc = snapshot.docs[snapshot.docs.length - 1];
    //             }
    //         }

    //         setMessage("Data migration completed!");
    //     } catch (error) {
    //         console.error("Error during migration:", error);
    //         setMessage("Error during migration. Check the console for details.");
    //     }

    //     setIsMigrating(false);
    // };

    return (
        <div>
            <h1>Data Migration</h1>
            <button onClick={migrateData} disabled={isMigrating}>
                {isMigrating ? "Migrating..." : "Start Migration"}
            </button>
            <p>{message}</p>
        </div>
    );
}