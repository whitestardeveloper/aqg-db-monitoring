import { Box, IconButton, Rating, Typography } from '@mui/material';
import React from 'react'
import { getJsonArrayFromRaw, getJsonObjectFromRaw } from '../utils';
import VisibilityIcon from '@mui/icons-material/Visibility';

type ReviewerCardProps = {
  reviwer: any;
  onShowDetail: () => void;
}

export default function ReviewerCard({ reviwer, onShowDetail }: ReviewerCardProps) {
  const getGeneralReviwerRating = () => {

    if (reviwer.reviewer_type === 'ai') {

      const rates_object = getJsonObjectFromRaw(reviwer?.rates);
      // Extract all evaluation_value values from the data
      const values = Object.values(rates_object).map((item: any) => item?.evaluation_value || 0);
      // Calculate the average
      const total = values.reduce((sum, value) => sum + value, 0);
      const average = total / values.length;

      return average;

      // reviwer.rates.red(rate => )
    }


    let generalRate = (reviwer.rates.question_type_rating + reviwer.rates.question_diff_level_rating + reviwer.rates.question_relevance_rating) / 3;
    return generalRate;
  }

  console.log(reviwer)

  return (
    <Box sx={{ display: 'flex', gap: 2, my: 1, alignItems: 'center'}}>
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
  
      <IconButton aria-label="delete" onClick={onShowDetail}>
        <VisibilityIcon fontSize="inherit" />
      </IconButton>

    </Box>
  )
}