import { Box, Typography } from '@mui/material';
import MarkdownPreview from '@uiw/react-markdown-preview';
import React from 'react';

type Props = {
  question: any;
  questionType: string;
  questionIndex: number;
}

export default function QuestionCard({ question, questionType, questionIndex }: Props) {
  return (
    <Box>
      {questionType === 'Çoktan Seçmeli' ? (
        <QuestionMultipleChoices body={question?.question_body} answers={question?.answers} questionIndex={questionIndex} />
      ) : (
        <>{`${questionType} formatı yakında desteklenecektir...`}</>
      )}
    </Box>
  )
}

type QuestionMultipleChoicesProps = {
  questionIndex: number;
  body?: string;
  answers?: any[];
}

function QuestionMultipleChoices({ questionIndex, body, answers }: QuestionMultipleChoicesProps) {
  const choiceLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Typography fontWeight="bold">{questionIndex + '-'}</Typography>
        <MarkdownPreview source={body} />
      </Box>
      {answers?.map((answer: any, index: number) => (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            fontWeight: answer?.correct ? 'bold' : 'normal',
            color: answer?.correct ? theme => theme.palette.success.main : '#000'
          }}
        >
          <Typography sx={{ fontWeight: answer?.correct ? 'bold' : 'normal' }}>
            {choiceLabels[index] + ')'}
          </Typography>
          <MarkdownPreview source={answer?.content} style={{ color: answer?.correct ? '#2E7D32' : '#000' }} />
        </Box>
      ))}
    </Box>
  )
}