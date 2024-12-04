import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Box, Button, Divider, FormControlLabel, Rating, Switch, TextField, Typography } from '@mui/material';
import { getDatabase, ref, set } from "firebase/database";
import { firebaseConfig } from '../utils';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  reviwerList: any[];
  questionKey: string;
};

export default function ReviewerForm({ open, setOpen, questionKey, reviwerList }: Props) {
  const [isValidQuestion, setIsIndavalid] = useState(true);
  const [questionTypeRating, setQuestionTypeRating] = useState<number | null>(0);
  const [questionDiffLevelRating, setQuestionDiffLevelRating] = useState<number | null>(0);
  const [questionRelevanceRating, setQuestionRelevanceRating] = useState<number | null>(0); // Soru içeriği uygun mu ?
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [mail, setMail] = useState('');

  useEffect(() => {
    if (!isValidQuestion) {
      setQuestionTypeRating(0);
      setQuestionDiffLevelRating(0);
      setQuestionRelevanceRating(0);
    }
  }, [isValidQuestion])


  const handleCloseReviewForm = () => {
    setOpen(false);
  }


  const handleSubmit = () => {
    const dataRef = ref(database, `generated-question-list/${questionKey}/review`);
    const reviewerData = {
      reviewer_name: fullName,
      reviwer_mail: mail,
      description: description,
      is_valid_question: isValidQuestion,
      rates: {
        question_type_rating: questionTypeRating,
        question_diff_level_rating: questionDiffLevelRating,
        question_relevance_rating: questionRelevanceRating,
      }
    }

    //db save .... !!!
    set(dataRef, [...reviwerList, reviewerData])
      .then(() => {
        <Alert severity="success">Değerlendirme başarıyla eklendi.</Alert>
        console.log("Data replaced successfully!");
      })
      .catch((error) => {
        <Alert severity="error">Değerlendirme eklenemedi.</Alert>
        console.error("Error replacing data:", error);
      });

    handleCloseReviewForm();
    //update firebase review field
  }


  return (
    <Box sx={{ border: '1px solid green', borderRadius: 4, p: 2 }}>
      <form onSubmit={
        (e) => {
          e.preventDefault();
          handleSubmit();
        }
      }>
        <Typography variant="h5">
          Değerlendirme Ekle
        </Typography>

        <FormControlLabel
          control={
            <Switch checked={isValidQuestion} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsIndavalid(e.target.checked)} />
          }
          label="Soru geçerli"
        />
        <Typography sx={{ p: 0, m: 0, width: '100%', fontSize: '13px' }}>**Eğer sorunun geçersiz olduğunu düşünüyorsanız bu seçimi değiştirin.</Typography>

        <Typography mt={3}>
          Bu kısımda üretilen soruya değerlendirme girebilirsiniz. Aşağıdaki sorulan sorulara 1-5 arası score girebilirsiniz.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, opacity: !isValidQuestion ? 0.5 : 1, pointerEvents: !isValidQuestion ? 'none' : 'initial' }}>
            <Typography component="legend" mt={2}>Soruların tip uygunluğu</Typography>
            <Rating
              aria-required
              name="question-score"
              disabled={!isValidQuestion}
              value={questionTypeRating}
              onChange={(event, newValue) => {
                setQuestionTypeRating(newValue);
              }}
            />
            <Divider />

            <Typography component="legend">Soruların zorluk seviyesi uygunluğu</Typography>
            <Rating
              aria-required
              disabled={!isValidQuestion}
              name="question-score"
              value={questionDiffLevelRating}
              onChange={(event, newValue) => {
                setQuestionDiffLevelRating(newValue);
              }}
            />
            <Divider />

            <Typography component="legend">Sorunun konu içeriğine ve istenen verilere uygunluğu</Typography>
            <Rating
              aria-required
              disabled={!isValidQuestion}
              name="question-score"
              value={questionRelevanceRating}
              onChange={(event, newValue) => {
                setQuestionRelevanceRating(newValue);
              }}
            />
            <Divider />
          </Box>
          <TextField required label="İsim soyisim" variant="outlined" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <TextField label="Açıklama" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Mail Adresi" variant="outlined" value={mail} onChange={(e) => setMail(e.target.value)} />
        </Box>
        <Box mt={2}>
          <Button onClick={handleCloseReviewForm}>Vazgeç</Button>
          <Button variant="contained" type="submit" autoFocus>
            Ekle
          </Button>
        </Box>
      </form>
    </Box>
  )
}
