import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
type Props = {
  sourceIds: number[];
  allSourcesData: any[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function QuestionSourceDialog({ sourceIds, allSourcesData, open, setOpen }: Props) {
  const getSources = () => {
    return allSourcesData.filter((x: any) => sourceIds.findIndex(sourceId => sourceId === x?.id) > -1);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{"Heterojen Soru Kaynakları"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Soru üretilirken aşağıdaki kaynaklar birleştirilerek kullanılmaktadır.
        </DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {getSources().map((source: any) => (
            <QuestionSourceCard source={source} />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>Vazgeç</Button>
      </DialogActions>
    </Dialog>
  )
}


type QuestionSourceDialogProps = {
  source: any;
}

export function QuestionSourceCard({ source }: QuestionSourceDialogProps) {
  // Show full text state
  const [showFullText, setShowFullText] = useState(false);

  // Character limit for initial display
  const charLimit = 100;

  // Toggle function for the button
  const toggleShowFullText = () => {
    setShowFullText((prev) => !prev);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {source?.class} - {source?.course} - {source?.category}
        </Typography>
        <Typography variant="h5" component="div">
          {source?.source_type} - {source?.source_extract_tool}
          <Chip variant="filled" label={`${source.text_content.length} context uzunluğu`} color="warning" sx={{ ml: 2 }} />
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{source?.source_url}</Typography>
        <Typography variant="body2">
          {showFullText ? source.text_content : `${source.text_content.slice(0, charLimit)}...`}
        </Typography>

        {source.text_content.length > charLimit && (
          <Button size="small" onClick={toggleShowFullText}>
            {showFullText ? 'Daha Az Göster' : 'Hepsini Göster'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}