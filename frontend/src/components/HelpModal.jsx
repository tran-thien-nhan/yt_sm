import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import KeywordIcon from '@mui/icons-material/Label';
import ShareIcon from '@mui/icons-material/Share';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TableChartIcon from '@mui/icons-material/TableChart';

const HelpModal = ({ isOpen, onClose, isDarkMode }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="help-modal-title"
            aria-describedby="help-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 600,
                maxHeight: '90vh',
                bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
                border: `2px solid ${isDarkMode ? 'grey.800' : 'grey.300'}`,
                boxShadow: 24,
                p: 4,
                color: isDarkMode ? 'common.white' : 'text.primary',
                overflowY: 'auto',
                borderRadius: 2,
            }}>
                <Typography id="help-modal-title" variant="h4" component="h2" gutterBottom fontWeight="bold">
                    Hướng dẫn sử dụng
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                    Cách lấy nội dung từ YouTube:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <YouTubeIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Mở một video YouTube bất kỳ" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <TextFieldsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary='Kéo xuống phần mô tả, nhấp vào "hiện bản chép lời"' />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ContentCopyIcon color="action" />
                        </ListItemIcon>
                        <ListItemText primary="Sao chép toàn bộ nội dung và dán vào ứng dụng" />
                    </ListItem>
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                    Các tính năng chính:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <SummarizeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Tóm tắt văn bản"
                            secondary="Nhập nội dung, chọn kiểu và độ dài tóm tắt, sau đó nhấn 'Summarize'"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <AccountTreeIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Tạo biểu đồ"
                            secondary="Chọn loại biểu đồ và nhấn 'Tạo biểu đồ' để trực quan hóa thông tin"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <QuestionAnswerIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Tạo câu hỏi và thảo luận"
                            secondary="Sử dụng phần 'Discussion' để tạo câu hỏi tự động hoặc thảo luận"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <TextFieldsIcon color="info" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Tương tác với văn bản"
                            secondary="Bôi đen bất kỳ phần nào trong văn bản tóm tắt để hiển thị các tùy chọn"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <KeywordIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Từ khóa và đề xuất"
                            secondary="Xem từ khóa quan trọng và nhận đề xuất prompts để khám phá sâu hơn"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ShareIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Chia sẻ và xuất"
                            secondary="Sao chép, chia sẻ qua Facebook, hoặc xuất kết quả ra file Word"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <PsychologyIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Phương pháp Feynman"
                            secondary="Giải thích nội dung bằng phương pháp Feynman"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <TableChartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Xuất ra Excel"
                            secondary="Xuất câu hỏi và câu trả lời ra file Excel để chèn vào Anki"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <PsychologyIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Phương pháp TRIZ"
                            secondary="Tìm kiếm giải pháp sáng tạo bằng phương pháp TRIZ"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <TableChartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Phân tích Excel"
                            secondary="Phân tích dữ liệu từ file Excel"
                        />
                    </ListItem>
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Đóng
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default HelpModal;
