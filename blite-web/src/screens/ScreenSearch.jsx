import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, List, ListItem, ListItemText, 
    ListItemIcon, Chip, Divider, CircularProgress, Button 
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useWorkspace } from '../context/WorkspaceContext';

export default function ScreenSearch() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Read ?q= from URL
    const { activeWorkspace } = useWorkspace();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query && activeWorkspace) {
            setLoading(true);
            axios.get(`http://localhost:8080/api/search?q=${query}&workspaceId=${activeWorkspace.id}`)
                 .then(res => setResults(res.data))
                 .catch(err => console.error(err))
                 .finally(() => setLoading(false));
        }
    }, [query, activeWorkspace]);

    const handleSelect = (item) => {
        if (item.type === 'CONNECTION') navigate('/connections');
        else if (item.type === 'NOTEBOOK') navigate('/query');
    };

    return (
        <Box maxWidth="800px" mx="auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
            
            <Typography variant="h4" gutterBottom>
                Search Results for "{query}"
            </Typography>
            
            <Typography variant="body2" color="text.secondary" mb={4}>
                Found {results.length} matches in {activeWorkspace?.name}
            </Typography>

            {loading ? <CircularProgress /> : (
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {results.length === 0 && (
                            <Box p={4} textAlign="center">
                                <Typography color="text.secondary">No results found.</Typography>
                            </Box>
                        )}
                        
                        {results.map((item, index) => (
                            <div key={item.id}>
                                <ListItem button alignItems="flex-start" onClick={() => handleSelect(item)} sx={{ py: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 50, mt: 0.5 }}>
                                         <Box sx={{ 
                                            p: 1, borderRadius: '8px', 
                                            bgcolor: item.type === 'CONNECTION' ? '#F0F9FF' : '#F5F3FF',
                                            color: item.type === 'CONNECTION' ? '#0284C7' : '#7C3AED'
                                        }}>
                                            {item.type === 'CONNECTION' ? <StorageIcon /> : <DescriptionIcon />}
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                <Typography variant="h6" fontSize="1rem" fontWeight={600}>{item.title}</Typography>
                                                <Chip label={item.type} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description || "No description available."}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < results.length - 1 && <Divider component="li" />}
                            </div>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}