import { Box, Button, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


type FiltersProps = {
 
}

export default function Filters({  }: FiltersProps) {
  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);
  const nav = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [qType, setQType] = useState('');
  const [qDiffLevel, setQDiffLevel] = useState('');
  const [qModel, setQModel] = useState('');

  const [qClass, setQClass] = useState<string>('');
  const [qCourse, setQCourse] = useState<string>('');
  const [qCategory, setQCategory] = useState<string>('');


  const applyFilters = () => {
    let filterParams = '';

    if (searchText !== '') {
      filterParams += 'search=' + searchText
    }

    if (qType !== '') {
      filterParams += '&qType=' + qType
    }

    if (qDiffLevel !== '') {
      filterParams += '&qDiffLevel=' + qDiffLevel
    }

    if (qModel !== '') {
      filterParams += '&qModel=' + qModel
    }

    //////////////////////// class-course-category
    if (qClass !== '') {
      filterParams += '&qClass=' + qClass
    }

    if (qCourse !== '') {
      filterParams += '&qCourse=' + qCourse
    }

    if (qCategory !== '') {
      filterParams += '&qCategory=' + qCategory
    }

    nav(`/question-list?${filterParams}`, { replace: true });
    
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 1 }}>
      <Box sx={{ border: '1px solid #edc', borderRadius: 1.5 }}>
        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id="q-type-label">Sınıf</InputLabel>
          <Select
            labelId="q-type-label"
            id="q-type"
            value={qClass}
            label="Sınıf"
            onChange={(e) => {
              setQCategory('');
              setQClass(e.target.value)
            }}
          >
            <MenuItem value=""> <em>None</em></MenuItem>
            {student_class.map(type => (
              <MenuItem value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id="q-type-label">Ders</InputLabel>
          <Select
            labelId="q-type-label"
            id="q-type"
            value={qCourse}
            label="Ders"
            onChange={(e) => {
              setQCategory('');
              setQCourse(e.target.value)
            }}
          >
            <MenuItem value=""> <em>None</em></MenuItem>
            {courses.map(type => (
              <MenuItem value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id="q-type-label">Konu</InputLabel>
          <Select
            labelId="q-type-label"
            id="q-type"
            value={qCategory}
            label="Konu"
            onChange={(e) => setQCategory(e.target.value)}
          >
            <MenuItem value=""> <em>None</em></MenuItem>
            {qClass !== '' && qCourse !== '' && categories[`${qClass}-${qCourse}`].map((i: any) => (
              <MenuItem value={i}>{i}</MenuItem>
            ))}
          </Select>
        </FormControl>

      </Box>


      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
        <InputLabel id="q-type-label">Soru Tipi</InputLabel>
        <Select
          labelId="q-type-label"
          id="q-type"
          value={qType}
          label="Soru Tipi"
          onChange={(e) => setQType(e.target.value)}
        >
          <MenuItem value=""> <em>None</em></MenuItem>
          {q_types.map(type => (
            <MenuItem value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
        <InputLabel id="q-type-label">Zorluk Seviyesi</InputLabel>
        <Select
          labelId="q-type-label"
          id="q-type"
          value={qDiffLevel}
          label="Zorluk Seviyesi"
          onChange={(e) => setQDiffLevel(e.target.value)}
        >
          <MenuItem value=""> <em>None</em></MenuItem>
          {q_diff_levels.map(type => (
            <MenuItem value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
        <InputLabel id="q-type-label">Yapay Zeka Modeli</InputLabel>
        <Select
          labelId="q-type-label"
          id="q-type"
          value={qModel}
          label="Yapay Zeka Modeli"
          onChange={(e) => setQModel(e.target.value)}
        >
          <MenuItem value=""> <em>None</em></MenuItem>
          {models.map(type => (
            <MenuItem value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>


      <TextField placeholder="Üretilmiş sorular içerisindeki metinlerde ara !!!" value={searchText} onChange={(e) => setSearchText(e.target.value)} sx={{ ml: 5, minWidth: 450, my: 'auto' }} size="small" />

      <Button variant="contained" sx={{ borderRadius: 12, textDecoration: 'none', ml: 'auto' }} onClick={applyFilters}>
        Filtreleri Uygula
      </Button>

    </Box>
  )
}

export const q_types = ["Çoktan Seçmeli", "Doğru Yanlış", "Boşluk doldurma", "Açık Soru", "Eşleştirme", "Kısa Cevaplı"]
export const q_diff_levels = ['kolay', 'orta', 'zor']
export const models = ["GOOGLE (gemini-1.5-flash)", "GOOGLE (gemma2)", "MISTRAL (mistral-nemo)", "META (llama3.1) [70b]", "ALIBABA (qwen2.5)", "NVIDIA (nvidia/nemotron-4-340b-instruct)", "Cohere For AI (aya-expanse)[8B]"]
export const student_class = ['5. sınıf', '6. sınıf', '7. sınıf', '8. sınıf']
export const courses = ['Türkçe', 'Sosyal Bilgiler', 'Fen Bilimleri']
export const categories: any = {
  "5. sınıf-Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Parçada Anlam", "Görsel Okuma - Sözel mantık", "Noktalama İşaretleri"],
  "5. sınıf-Sosyal Bilgiler": ["Gruplar, Roller ve  Çocuk Hakları", "Toplum İçinde Birlik ve Beraberlik", "Dünyanın Çekim Noktasındayız", "Haritalar", "İklim ve İnsan Faaliyetleri"],
  "5. sınıf-Fen Bilimleri": ["Gökyüzündeki Komşumuz: Güneş", "Gökyüzündeki Komşumuz:Ay", "Ay’ın Hareketleri ve Evreleri", "Güneş, Dünya ve Ay", "Bitkiler ve Hayvanlar"],
  "6. sınıf-Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Parçada Anlam", "Zamir", "Sıfat - Sıfat Tamlaması"],
  "6. sınıf-Sosyal Bilgiler": ["Bireyin Gelişimi ve Sosyal Roller", "Toplumsal Yardımlaşma ve Dayanışma", "İlk Türk Devletlerinde Sosyal-Kültürel Hayat", "İslamiyet’in Doğuşu ve Türkler", "Anadolu’ya Giriş"],
  "6. sınıf-Fen Bilimleri": ["Güneş Sistemi", "Güneş ve Ay Tutulmaları", "Destek ve Hareket Sistemi", "Sindirim Sistemi", "Dolaşım Sistemi"],
  "7. sınıf-Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Parçada Anlam", "Zarf", "Anlatım Bozuklukları"],
  "7. sınıf-Sosyal Bilgiler": ["İnsandan İnsana Giden Yol", "Hızlı İletişim Güçlü Toplum", "Beylikten Cihan Devletine", "İnsanı Yaşat ki Devlet Yaşasın", "Avrupa’da Uyanış"],
  "7. sınıf-Fen Bilimleri": ["Uzay Araştırmaları", "Enerji Dönüşümleri", "Hücre", "Mitoz ve Mayoz", "Kütle ve Ağırlık İlişkisi"],
  "8. sınıf-Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Parçada Anlam", "Anlatım Bozuklukları", "Yazım Kuralları"],
  "8. sınıf-Sosyal Bilgiler": ["Yirminci Yüzyıl Başlarında Osmanlı Devleti ve Dünya", "Birinci Dünya Savaşı", "Mondros Ateşkes Antlaşması ve Sonrası", "Milli Mücadeleye Hazırlık", "Amasya Görüşmeleri’nden Sevr Antlaşması’na"],
  "8. sınıf-Fen Bilimleri": ["Mevsimlerin Oluşumu", "İklim ve Hava Olayları", "DNA ve Genetik Kod", "Mutaston, Modifikasyon ve Doğal Seçilim", "Mendel Yasaları ve Kalıtım"],
}

