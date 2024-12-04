import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, Divider, Rating, TextField, Typography } from '@mui/material';

type Props = {
    questionId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function AddReviewerDialog({ open, setOpen }: Props) {
    const [questionTypeRating, setQuestionTypeRating] = React.useState<number | null>(0);
    const [questionDiffLevelRating, setQuestionDiffLevelRating] = React.useState<number | null>(0);
    const [questionRelevanceRating, setQuestionRelevanceRating] = React.useState<number | null>(0); // Soru içeriği uygun mu ?

    const [description, setDescription] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [mail, setMail] = React.useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const addReviewer = () => {
        const reviewerData = {
            rating: questionRelevanceRating,
            description: description,
            user: {
                mail: mail,
                fullName: fullName
            }
        }

        //update firebase review field

        handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Değerlendirme Ekle"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bu kısımda üretilen soruya değerlendirme girebilirsiniz. Aşağıdaki sorulan sorulara 1-5 arası score girebilirsiniz.
                </DialogContentText>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography component="legend" mt={2}>Soruların tip uygunluğu</Typography>
                    <Rating
                        aria-required
                        name="question-score"
                        value={questionTypeRating}
                        onChange={(event, newValue) => {
                            setQuestionTypeRating(newValue);
                        }}
                    />
                    <Divider />

                    <Typography component="legend">Soruların zorluk seviyesi uygunluğu</Typography>
                    <Rating
                        aria-required
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
                        name="question-score"
                        value={questionRelevanceRating}
                        onChange={(event, newValue) => {
                            setQuestionRelevanceRating(newValue);
                        }}
                    />
                    <Divider />

                    <TextField required label="İsim soyisim" variant="outlined" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <TextField label="Açıklama" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TextField label="Mail Adresi" variant="outlined" value={mail} onChange={(e) => setMail(e.target.value)} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Vazgeç</Button>
                <Button variant="contained" onClick={addReviewer} autoFocus>
                    Ekle
                </Button>
            </DialogActions>
        </Dialog>
    )
}
