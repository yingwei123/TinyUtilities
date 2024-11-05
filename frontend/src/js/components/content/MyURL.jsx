import React from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ApiClient from '../../ApiClient';
import { useEffect, useState } from 'react';

const MyURL = ({ onClose }) => {
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState(null);

    useEffect(() => {
        const fetchURLs = async () => {
            try {
                const response = await ApiClient.makeGetRequest('/url/all');
                const data = response.data;
                if(data.length > 0) {
                    setUrls(data);
                }
            } catch (err) {
                console.error('Error fetching URLs:', err);
                setError('Failed to load URLs');
            }
        };

        fetchURLs();
    }, []);

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
    };
    
    const handleDeleteClick = (url) => {
        setUrlToDelete(url);
        setDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (urlToDelete) {
            const response = await ApiClient.makeDeleteRequest(`/url/${urlToDelete._id}`);
            if(response.status === 204) {
                setUrls(prevUrls => prevUrls.filter(url => url.tiny_url !== urlToDelete.tiny_url));
            }
                        
            setDeleteDialog(false);
            setUrlToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog(false);
        setUrlToDelete(null);
    };

    return (
        <Box>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                My URLs
            </Typography>
            <List>
                {urls.map((url, index) => (
                    <ListItem 
                        key={index}
                        secondaryAction={
                            <Box>
                                <IconButton 
                                    edge="end" 
                                    aria-label="copy"
                                    onClick={() => handleCopy(url.tiny_url)}
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete"
                                    onClick={() => handleDeleteClick(url)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        }
                    >
                        <ListItemText
                            primary={url.tiny_url}
                            secondary={url.original_url}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {urlToDelete?.tiny_url}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyURL;
