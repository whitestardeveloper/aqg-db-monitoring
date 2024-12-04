import { Box, Rating, Typography } from '@mui/material';
import React from 'react'

type ReviewerCardProps = {
  reviwer: any;
}

export default function ReviewerCard({ reviwer }: ReviewerCardProps) {
  const getGeneralReviwerRating = () => {
    let generalRate = (reviwer.rates.question_type_rating + reviwer.rates.question_diff_level_rating + reviwer.rates.question_relevance_rating) / 3;
    return generalRate;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
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
    </Box>
  )
}