import { useState, useEffect } from 'react';
import { 
    Typography, Paper, Button, Box, Stack, Alert, 
    CircularProgress, FormControl, Select, MenuItem,
    TextField, List, ListItem, ListItemText, IconButton, ListItemButton, ListItemIcon,
    Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem as ContextMenuItem
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import PreviewTable from '../components/PreviewTable';
import CodeMirror from '@uiw/react-codemirror';
import { sql as sqlLang } from '@codemirror/lang-sql';
import { bliteEditorTheme } from '../theme/editorTheme'; 
import { useWorkspace } from '../context/WorkspaceContext';

export default function ScreenQuery() {
    const { activeWorkspace } = useWorkspace();
    
    // State
    const [savedQueries, setSavedQueries] = useState([]);
    const [activeQueryId, setActiveQueryId] = useState(null); 
    
    // Editor Fields
    const [queryName, setQueryName] = useState("Untitled Notebook");
    const [sqlQuery, setSqlQuery] = useState("SELECT * FROM demo_table LIMIT 10;");
    const [description, setDescription] = useState("");
    
    // UI State
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [connections, setConnections] = useState([]);
    const [selectedConnId, setSelectedConnId] = useState('');
    
    // Rename Dialog State
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState(null); // { id, name }
    const [newName, setNewName] = useState("");

    // --- 1. Load Data ---
    useEffect(() => {
        if (!activeWorkspace) return;
        
        axios.get(`http://localhost:8080/api/connections?workspaceId=${activeWorkspace.id}`)
            .then(res => {
                setConnections(res.data);
                if (res.data.length > 0) setSelectedConnId(res.data[0].id);
            });

        fetchSavedQueries();
    }, [activeWorkspace]);

    const fetchSavedQueries = () => {
        axios.get(`http://localhost:8080/api/queries?workspaceId=${activeWorkspace.id}`)
            .then(res => setSavedQueries(res.data));
    };

    // --- 2. Notebook Actions ---
    const handleSelectQuery = (q) => {
        setActiveQueryId(q.id);
        setQueryName(q.name || "Untitled"); // Handle potential nulls
        setSqlQuery(q.sqlText || "");
        setDescription(q.description || "");
        setResults([]);
        setError(null);
    };

    const handleNewQuery = () => {
        setActiveQueryId(null);
        setQueryName("New Notebook");
        setSqlQuery("-- Write your SQL here\n");
        setDescription("");
        setResults([]);
    };

    const handleSaveQuery = async () => {
        if (!activeWorkspace) return;
        
        try {
            const payload = {
                id: activeQueryId, 
                name: queryName,
                sqlText: sqlQuery,
                description: description,
                workspaceId: activeWorkspace.id
            };
            
            // Save to Backend
            const res = await axios.post('http://localhost:8080/api/queries', payload);
            
            // Update UI
            setActiveQueryId(res.data.id);
            fetchSavedQueries(); 
            // alert("Notebook saved!"); // Optional feedback
        } catch (err) {
            console.error(err);
            alert("Failed to save notebook. Check console for details.");
        }
    };

    const handleDeleteQuery = async (id, e) => {
        e.stopPropagation();
        if(!window.confirm("Delete this notebook?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/queries/${id}`);
            fetchSavedQueries();
            if (activeQueryId === id) handleNewQuery();
        } catch(err) { console.error(err); }
    };

    const handleRunQuery = async () => {
        if (!selectedConnId) return setError("Select a connection first.");
        setLoading(true); setError(null);
        try {
            const activeConn = connections.find(c => c.id === selectedConnId);
            const res = await axios.post('http://localhost:8080/api/query', { sql: sqlQuery, dbConfig: activeConn });
            setResults(res.data);
        } catch (err) { setError(err.response?.data?.message || "Error executing query"); }
        finally { setLoading(false); }
    };

    // --- 3. Rename Dialog Handlers ---
    const openRenameDialog = (e, q) => {
        e.stopPropagation();
        setRenameTarget(q);
        setNewName(q.name);
        setRenameDialogOpen(true);
    };

    const handleRenameSubmit = async () => {
        if (!renameTarget || !newName) return;
        
        // We reuse the save endpoint, but preserve the existing SQL/Description
        const payload = {
            ...renameTarget, // Copy existing fields (sqlText, etc)
            name: newName,
            workspaceId: activeWorkspace.id
        };

        try {
            await axios.post('http://localhost:8080/api/queries', payload);
            fetchSavedQueries();
            
            // If we renamed the currently open query, update the header input too
            if (activeQueryId === renameTarget.id) {
                setQueryName(newName);
            }
            setRenameDialogOpen(false);
        } catch (err) {
            alert("Failed to rename");
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '88vh', gap: 2 }}>
            
            {/* --- LEFT SIDEBAR --- */}
            <Paper sx={{ width: 250, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <Box p={2} borderBottom="1px solid #eee" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={600}>Notebooks</Typography>
                    <IconButton size="small" onClick={handleNewQuery} color="primary"><AddIcon /></IconButton>
                </Box>
                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {savedQueries.map(q => (
                        <ListItem 
                            key={q.id} 
                            disablePadding 
                            secondaryAction={
                                <Box>
                                    <IconButton size="small" onClick={(e) => openRenameDialog(e, q)}>
                                        <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={(e) => handleDeleteQuery(q.id, e)}>
                                        <DeleteIcon fontSize="small" sx={{ fontSize: 16, opacity: 0.7 }} />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemButton selected={activeQueryId === q.id} onClick={() => handleSelectQuery(q)}>
                                <ListItemIcon sx={{ minWidth: 30 }}><DescriptionIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary={q.name} primaryTypographyProps={{ noWrap: true, fontSize: '0.9rem' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* --- RIGHT EDITOR --- */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {/* VISIBLE NAME INPUT */}
                    <TextField 
                        value={queryName} 
                        onChange={(e) => setQueryName(e.target.value)}
                        placeholder="Notebook Name"
                        variant="standard"
                        InputProps={{ 
                            disableUnderline: true, 
                            style: { fontSize: '1.2rem', fontWeight: 600 } 
                        }}
                        sx={{ 
                            flexGrow: 1, 
                            mr: 2,
                            border: '1px solid transparent',
                            borderRadius: 1,
                            px: 1,
                            '&:hover': { border: '1px solid #E2E8F0', bgcolor: 'white' }, // Hover effect
                            '&:focus-within': { border: '1px solid #2563EB', bgcolor: 'white' }
                        }}
                    />
                    
                    <Stack direction="row" spacing={2}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select value={selectedConnId} displayEmpty onChange={(e) => setSelectedConnId(e.target.value)} sx={{ height: 36, bgcolor: 'white' }}>
                                <MenuItem value="" disabled>Select Connection</MenuItem>
                                {connections.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSaveQuery}>Save</Button>
                        <Button variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit"/> : <PlayArrowIcon />} onClick={handleRunQuery} disabled={loading}>Run</Button>
                    </Stack>
                </Stack>

                <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <CodeMirror 
                        value={sqlQuery} 
                        height="100%" 
                        extensions={[sqlLang()]} 
                        theme={bliteEditorTheme} 
                        onChange={(val) => setSqlQuery(val)} 
                        style={{ fontSize: '14px', height: '100%' }}
                    />
                </Paper>

                <Box sx={{ height: '40%', borderTop: '1px solid #e0e0e0', overflow: 'auto', bgcolor: 'white' }}>
                    {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
                    {results.length > 0 ? <PreviewTable data={results} /> : (
                        <Typography variant="caption" color="text.secondary" sx={{ p: 2, display: 'block', textAlign: 'center' }}>
                            Results will appear here
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* --- RENAME DIALOG --- */}
            <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
                <DialogTitle>Rename Notebook</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Notebook Name"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRenameSubmit} variant="contained">Rename</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}