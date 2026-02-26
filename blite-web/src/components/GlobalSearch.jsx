import { useState, useEffect } from 'react';
import { 
    Box, InputBase, List, ListItem, ListItemText, ListItemIcon, 
    Paper, ClickAwayListener, Typography, Chip, Divider, IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export default function GlobalSearch() {
    const { activeWorkspace } = useWorkspace();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();

    // 1. Live Search (Debounced) - Keeps the dropdown functionality
    useEffect(() => {
        if (query.length < 2 || !activeWorkspace) {
            setResults([]);
            return;
        }
        
        const delayDebounce = setTimeout(() => {
            axios.get(`http://localhost:8080/api/search?q=${query}&workspaceId=${activeWorkspace.id}`)
                 .then(res => {
                     setResults(res.data);
                     setOpen(true);
                 })
                 .catch(() => setResults([]));
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query, activeWorkspace]);

    // 2. Navigation Helper: Go to dedicated Search Page
    const goToSearchPage = () => {
        if (query.trim().length > 0) {
            setOpen(false); // Close dropdown
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    // 3. Quick Select (Clicking a result in the dropdown)
    const handleSelect = (item) => {
        if (item.type === 'CONNECTION') {
            navigate('/connections');
        } else if (item.type === 'NOTEBOOK') {
            navigate('/query');
        }
        setOpen(false);
        setQuery("");
    };

    return (
        <ClickAwayListener onClickAway={() => { setOpen(false); setFocused(false); }}>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
                
                <Paper
                    elevation={focused ? 3 : 0}
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: '10px', 
                        border: '1px solid',
                        borderColor: focused ? '#2563EB' : '#E2E8F0',
                        bgcolor: focused ? '#FFFFFF' : '#F8FAFC',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <SearchIcon sx={{ color: focused ? '#2563EB' : '#94A3B8', ml: 2, mr: 1 }} />
                    
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: '0.95rem', color: '#1E293B', fontWeight: 500 }}
                        placeholder="Search connections, notebooks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { setFocused(true); if(results.length > 0) setOpen(true); }}
                        // --- CHANGED: Pressing Enter goes to Search Page ---
                        onKeyDown={(e) => { 
                            if(e.key === 'Enter') {
                                goToSearchPage(); 
                            }
                        }}
                    />

                    {!query && (
                        <Box sx={{ display: 'flex', mr: 2, opacity: 0.6 }}>
                             <Chip 
                                label={<Box display="flex" alignItems="center" gap={0.5}><KeyboardCommandKeyIcon style={{ fontSize: 12 }} /> <Typography variant="caption" fontWeight={700}>K</Typography></Box>}
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer' }} 
                            />
                        </Box>
                    )}

                    {query.length > 0 && (
                        <>
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton 
                                color="primary" 
                                sx={{ p: '10px' }} 
                                // --- CHANGED: Button click goes to Search Page ---
                                onClick={goToSearchPage} 
                                title="Search"
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </>
                    )}
                </Paper>
                
                {/* Dropdown remains the same for quick suggestions */}
                {open && results.length > 0 && (
                    <Paper sx={{ 
                        position: 'absolute', top: 55, left: 0, right: 0, zIndex: 1300, 
                        maxHeight: 400, overflow: 'auto', boxShadow: 4, borderRadius: '12px', border: '1px solid #E2E8F0', p: 1
                    }}>
                        <Typography variant="caption" sx={{ px: 2, py: 1, color: '#64748B', fontWeight: 600 }}>QUICK RESULTS</Typography>
                        <List dense disablePadding>
                            {results.map((item, index) => (
                                <ListItem button key={`${item.type}_${item.entityId}_${index}`} onClick={() => handleSelect(item)} sx={{ borderRadius: '8px', mb: 0.5, '&:hover': { bgcolor: '#EFF6FF' } }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Box sx={{ p: 0.8, borderRadius: '8px', bgcolor: item.type === 'CONNECTION' ? '#F0F9FF' : '#F5F3FF', color: item.type === 'CONNECTION' ? '#0284C7' : '#7C3AED', display: 'flex' }}>
                                            {item.type === 'CONNECTION' ? <StorageIcon fontSize="small"/> : <DescriptionIcon fontSize="small"/>}
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.title} 
                                        secondary={<Typography variant="caption" color="text.secondary"><span style={{ fontWeight: 600, fontSize: '0.65rem' }}>{item.type}</span> • {item.description?.substring(0, 30)}...</Typography>} 
                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
}