import { Box, Divider, IconButton, Rating, Typography } from '@mui/material';
import React from 'react'
import { getJsonArrayFromRaw, getJsonObjectFromRaw } from '../utils';
import MarkdownPreview from '@uiw/react-markdown-preview';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

type ReviewerDetailProps = {
  reviwer: any;
  onCloseDetail: () => void;
}

export default function ReviewerDetail({ reviwer, onCloseDetail }: ReviewerDetailProps) {

  const getRatesObject = () => {
    const rates_object = getJsonObjectFromRaw(reviwer?.rates);
    const values = Object.values(rates_object) as any[];
    return values;
  }

  const getGeneralReviwerRating = () => {
    if (reviwer.reviewer_type === 'ai') {
      const rates = getRatesObject();
      const total = rates.map(value => value?.evaluation_value || 0).reduce((sum, value) => sum + value, 0);
      const average = total / rates.length;

      return average;
    } else {
      let generalRate = (reviwer.rates.question_type_rating + reviwer.rates.question_diff_level_rating + reviwer.rates.question_relevance_rating) / 3;
      return generalRate;
    }
  }

  console.log(reviwer)

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 4, alignItems: 'center' }}>
        <Rating
          readOnly
          name="question-score"
          value={getGeneralReviwerRating()}
        />
        <Typography fontWeight={'bold'}>
          {reviwer.reviewer_name}
        </Typography>
        {reviwer.reviwer_mail && (
          <Typography>
            {reviwer.reviwer_mail}
          </Typography>
        )}

        <IconButton aria-label="delete" onClick={onCloseDetail}>
          <VisibilityOffIcon fontSize="inherit" />
        </IconButton>
      </Box>


      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Değerlendirme Detayları</Typography>
        {reviwer.reviewer_type === 'ai' ? (
          getRatesObject().map((rate: any, index: number, rate_list: any[]) => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {rate?.evaluation_question.split('-').map((question_item: any, question_index: number) => (
                <Typography sx={{ ml: question_index > 0 ? 1.75 : 0 }}>
                  {question_index === 0 ? `${index + 1} - ` : '-'}
                  {question_item}
                </Typography>
              ))}

              <Rating
                readOnly
                sx={{ ml: 1.75 }}
                name={rate?.evaluation_type}
                value={rate?.evaluation_value}
              />
              <Typography variant="caption" sx={{ ml: 1.75 }}>{rate?.description}</Typography>
              {index + 1 !== rate_list.length && (<Divider sx={{ mt: 2 }} />)}
            </Box>
          ))
        ) : (
          <></>
        )
        }
      </Box>
    </Box>
  )
}