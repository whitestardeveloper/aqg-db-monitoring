export const firebaseConfig = {
    authDomain: "automatic-question-creato.firebaseapp.com",
    databaseURL: "https://automatic-question-creator-default-rtdb.firebaseio.com",
    projectId: "automatic-question-creator",
    storageBucket: "automatic-question-creator.appspot.com",
  };
  

export const warningTexts = [
    'metinde bahse',
    'verilen bil',
    'Konuşmanın Özenli Olması Gerekir',
    'Metin, aşağıdaki kavramlardan hang',
    'etin, eğitici yayınlarda kullanılan',
    'Metinde, açıklayıcı anlatımda hangi soruların ceva',
    'metinde geçmekte',
    'metinde geçen',
    'metne dayalı',
    'Mitoz bölünmenin ilk evresi hangisidir? Çeviri: Profaz Cevap: P',
    'Siz bana direktifleri vereceksiniz ve ben de ona göre çalışacağım. Lütfen bekleyiniz...',
    '器官细胞中的色素体能够赋予植物组织哪些颜色，并在哪些部位可以找到它们？ - 正确答案',
    '让给中文版本： - 在锡瓦斯会议上',
    'A) Nasıl?',
    'Metnin konusu nedir',
    'e verilen metne gör',
];

export const isWarningIncludes = (generatedText: string) => {
    return warningTexts.findIndex(w => generatedText.toLowerCase().includes(w.toLowerCase())) > -1;
}


// # Kaynakların eğitim seviyeleri => Ortaokul (5, 6, 7, 8)
// # Kaynakların dersleri (Türkçe, Sosyal Bilgiler ve Fen Bilimleri)
// # Kaynakların hetorajen  olarak karıştığı vakit 60 adet oluyor. Yani soru üretiminde 60 heterojen kaynak kullanılacak.
// # Her üretimde 3 adet soru üretilecek.
// # Üretim ayrı ayrı olmak üzere "Çoktan Seçmeli", "Doğru Yanlış", "Boşluk doldurma", "Açık Soru", "Eşleştirme" ve "Kısa Cevaplı" soru tiplerinden olacak.
// # Sorular 3 ayrı zorluk düzeyinde gerçekleşecek. (Kolay, Orta ve Zor)
// # Yukarıdaki sayılan özelliklerin hepsi ayrı ayrı 7 model üzerinde denenecek. ("GOOGLE (gemini-1.5-flash)", "GOOGLE (gemma2)", "MISTRAL (mistral-nemo)", "META (llama3.1)",  "ALIBABA (qwen2.5)", "NVIDIA (nvidia/nemotron-4-340b-instruct)", "Cohere For AI (aya-expanse)[8B])
// # Toplamda 3 * 6 * 60 * 7 = 7560 * 3(soru adedi) => 22.680 adet soru üretilmiş olacak.


