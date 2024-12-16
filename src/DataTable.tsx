import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Button, Chip, Divider, Fab } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import NavigationIcon from '@mui/icons-material/NavigationRounded';
import AddReviewerDialog from './components/AddReviewerDialog';
import QuestionSourceDialog from './components/QuestionSourceDialog';
import ReviewerForm from './components/ReviewerForm';
import ReviewerCard from './components/ReviewerCard';
import QuestionCard from './components/QuestionCard';
import ReviewerDetail from './components/ReviewerDetail';

type DataTableProps = {
  questionList: any[];
  allSourcesData: any;
}

export default function DataTable({ questionList, allSourcesData }: DataTableProps) {
  const [openedQuestionIds, setOpenedQuestionIds] = React.useState<number[]>([]);
  const [showedReviewerQuestionIds, setshowedReviewerQuestionIds] = React.useState<number[]>([]);

  const [openQuestionSourceDialog, setOpenQuestionSourceDialog] = React.useState(false);
  const [openReviewDialogKey, setOpenReviewDialogKey] = React.useState('');

  const handleOpenQuestion = (index: number) => {
    const clickedId = index;
    const newOpenedQuestionIds = [...openedQuestionIds];
    if (!newOpenedQuestionIds.includes(clickedId)) {
      newOpenedQuestionIds.push(clickedId);
    } else {
      newOpenedQuestionIds.splice(newOpenedQuestionIds.indexOf(clickedId), 1);
    }
    setOpenedQuestionIds(newOpenedQuestionIds);
  };

  const handleOpenReviwer = (index: number) => {
    const clickedId = index;
    const newOpenedReviewerQuestionIds = [...showedReviewerQuestionIds];
    if (!newOpenedReviewerQuestionIds.includes(clickedId)) {
      newOpenedReviewerQuestionIds.push(clickedId);
    } else {
      newOpenedReviewerQuestionIds.splice(newOpenedReviewerQuestionIds.indexOf(clickedId), 1);
    }
    setshowedReviewerQuestionIds(newOpenedReviewerQuestionIds);
  };


  const getJsonArrayQuestion = (questionRawList: any) => {
    // Eğer questionRawList zaten bir dizi ya da nesne ise, string'e dönüştürmeye gerek yok
    console.log(typeof questionRawList);

    // Eğer questionRawList bir stringse, onu işleyelim
    if (typeof questionRawList === "string") {
      // Gereksiz ` ```json ` ve ` ``` ` gibi karakterleri temizleyelim
      questionRawList = questionRawList.replace(/```json|```/g, '');
    }

    // Eğer verimiz hala string'teyse, False/True'yu işleyelim
    let cleanedData = questionRawList.replace(/False/g, 'false').replace(/True/g, 'true');

    try {
      // JSON.parse işlemi ile geçerli bir JSON nesnesine dönüştürme
      let parsedJson = JSON.parse(cleanedData);

      // parsedJson'ın türünü kontrol et
      console.log(typeof parsedJson);
      console.log(JSON.stringify(parsedJson))

      // Eğer parsedJson bir dizi ise döndürelim, yoksa boş dizi dönelim
      return Array.isArray(parsedJson) ? parsedJson : [];
    } catch (error) {
      console.error("JSON.parse hata:", error);
      return []; // JSON.parse hatası varsa boş dizi döndürelim
    }
  };

  // console.log(questionList);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Soru Index</TableCell>
            <TableCell>Soru Konusu</TableCell>
            <TableCell>Soru Tipi</TableCell>
            <TableCell>Zorluk Seviyesi</TableCell>
            <TableCell>Üreten Yapay Zeka Modeli</TableCell>
          </TableRow>
        </TableHead>
        {questionList && questionList.map((x: any, index: number) => (
          <TableBody>
            <TableRow>
              <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => handleOpenQuestion(index)}>
                  {openedQuestionIds.findIndex(i => i === index) > - 1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell>{x?.index}</TableCell>
              <TableCell>
                {x?.source_info?.class} -  {x?.source_info?.course} -  {x?.source_info?.category}
              </TableCell>
              <TableCell>{x?.questions_info?.question_type}</TableCell>
              <TableCell>{x?.questions_info?.question_difficulty_level}</TableCell>
              <TableCell>{x?.data?.generation_model}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openedQuestionIds.findIndex(i => i === index) > - 1} timeout="auto" unmountOnExit>
                  <Box margin={1}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ width: '100%', display: 'flex' }}>
                      Üretilen Sorunun Detayları
                      <Chip variant="filled" label={`${x?.source_info?.source_token_size} context uzunluğu`} sx={{ ml: 2 }} color="success" />
                      <Chip variant="filled" label={`${x?.data?.generation_elapsed_time.toFixed(2)} saniyede üretildi`} sx={{ ml: 2 }} color="info" />
                      <Fab variant="extended" color="secondary" sx={{ ml: 'auto' }} onClick={() => setOpenQuestionSourceDialog(true)}>
                        <NavigationIcon sx={{ mr: 1 }} />
                        Soru Kaynağını Göster
                      </Fab>
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                      <Box sx={{ border: '2px solid #eee', borderRadius: 8, p: 2, flex: 1, minWidth: 600 }}>
                        <Typography variant="h6" color="#dece85">Üretilen Soru</Typography>
                        <MarkdownPreview source={JSON.stringify(x?.data?.generated_questions, null, 4)} style={{ padding: 16 }} />
                        {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {getJsonArrayQuestion(x?.data?.generated_questions).map((q: any, qIndex: number) =>
                            <QuestionCard
                              questionType={x?.questions_info?.question_type}
                              question={q}
                              questionIndex={qIndex + 1}
                            />
                          )}
                        </Box> */}
                      </Box>

                      <Box sx={{ border: '2px solid #eee', borderRadius: 8, p: 2, flex: 1 }}>
                        <Typography variant="h6" color="#dece85">Değerlendirmeler</Typography>
                        {x?.review && Array.isArray(x?.review) ? (
                          x?.review?.map((r: any) => (
                            showedReviewerQuestionIds.findIndex(i => i === index) > - 1 ? (
                              <ReviewerCard reviwer={r} onShowDetail={() => handleOpenReviwer(index)} />
                            ) : (
                              <ReviewerDetail reviwer={r} onCloseDetail={() => handleOpenReviwer(index)} />
                            )
                          ))
                        ) : (
                          openReviewDialogKey === x.key && <Typography color="#008ecefe" mt={2}>Hiç değerlendirme Eklenmedi !</Typography>
                        )}

                        {openReviewDialogKey === x.key ? (
                          <ReviewerForm open={openReviewDialogKey === ''} setOpen={(open: boolean) => setOpenReviewDialogKey('')} questionKey={x?.key} reviwerList={x?.review && Array.isArray(x?.review) ? x?.review : []} />
                        ) : (
                          <Button variant="contained" startIcon={<PlaylistAddIcon />} sx={{ mt: 2 }} onClick={() => setOpenReviewDialogKey(x.key)}>
                            Değerlemdirme Ekle
                          </Button>
                        )}

                        {/* <AddReviewerDialog open={openReviewDialog} setOpen={setOpenReviewDialog} questionId={x.id} /> */}
                        <QuestionSourceDialog
                          open={openQuestionSourceDialog}
                          setOpen={setOpenQuestionSourceDialog}
                          sourceIds={x?.source_info?.source_ids || []}
                          allSourcesData={allSourcesData}
                        />

                        {/* <Typography>{x?.source_info?.source_token_size}</Typography> */}
                      </Box>
                    </Box>
                    <Box sx={{ border: '2px solid #eee', borderRadius: 8, p: 2, mt: 2 }}>
                      <Typography variant="h6" color="#dece85">Propmt Bilgisi</Typography>
                      <MarkdownPreview source={x?.data?.prompt} style={{ padding: 4, borderRadius: 8 }} />

                      {x?.data?.data_transaction && (
                        <Box sx={{ p: 2, mt: 2 }}>
                          <Typography variant="h6" color="#dece85">Diğer Bilgiler</Typography>
                          <Typography color="#008ecefe" mt={2}>Bu yazıda context uzunluğu model tarafından destektlendmediği için ÖZETLEME işlemi uygulanmıştır. Özetlenen metin :</Typography>
                          <MarkdownPreview source={x?.data?.text_from_transaction} style={{ padding: 4, borderRadius: 8 }} />
                        </Box>
                      )}
                    </Box>

                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </TableContainer >
  );
}