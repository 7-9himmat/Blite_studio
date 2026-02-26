import { useState, useEffect } from 'react';
import { 
    Typography, Paper, Button, Box, TextField, Grid, 
    Card, CardContent, IconButton, Chip, Stack, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StorageIcon from '@mui/icons-material/Storage';
import axios from 'axios';
import { useWorkspace } from '../context/WorkspaceContext'; // <--- Import Context

export default function ScreenConnections() {
    const { activeWorkspace } = useWorkspace(); // <--- Get Active Workspace
    const [connections, setConnections] = useState([]);
    const [formData, setFormData] = useState({
        id: null, name: '', type: 'POSTGRES', url: 'jdbc:postgresql://localhost:5432/blite_warehouse', 
        username: 'blite_user', password: 'blite_password'
    });
    const [isEditing, setIsEditing] = useState(false);

    // 1. Fetch connections ONLY for the active workspace
    const fetchConnections = async () => {
        if (!activeWorkspace) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/connections?workspaceId=${activeWorkspace.id}`);
            setConnections(res.data);
        } catch (err) { console.error(err); }
    };

    // Re-fetch whenever the user switches workspace
    useEffect(() => {
        fetchConnections();
    }, [activeWorkspace]); 

    const handleSave = async () => {
        if (!activeWorkspace) return alert("Please select a workspace first!");

        // 2. Tag the new connection with the Workspace ID
        const payload = { 
            ...formData, 
            workspace: { id: activeWorkspace.id } // JPA formatting
        };

        try {
            await axios.post('http://localhost:8080/api/connections', payload);
            fetchConnections();
            resetForm();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (conn) => {
        setFormData(conn);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this connection?")) return;
        await axios.delete(`http://localhost:8080/api/connections/${id}`);
        fetchConnections();
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', type: 'POSTGRES', url: 'jdbc:postgresql://localhost:5432/blite_warehouse', username: '', password: '' });
        setIsEditing(false);
    };

    return (
        <Box maxWidth="1000px">
            <Typography variant="h4" gutterBottom>Connection Manager</Typography>
            <Chip 
                label={`Workspace: ${activeWorkspace?.name || 'None'}`} 
                color="primary" 
                variant="outlined" 
                sx={{ mb: 4 }} 
            />
            
            <Grid container spacing={4}>
                {/* Form Section */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            {isEditing ? 'Edit Connection' : 'New Connection'}
                        </Typography>
                        <Stack spacing={2}>
                            <TextField 
                                label="Name" fullWidth size="small"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="e.g. Prod DB"
                            />
                             <TextField 
                                label="JDBC URL" fullWidth size="small"
                                value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} 
                            />
                            <Stack direction="row" spacing={1}>
                                <TextField 
                                    label="User" fullWidth size="small"
                                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} 
                                />
                                <TextField 
                                    label="Pass" type="password" fullWidth size="small"
                                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                                />
                            </Stack>
                            
                            <Stack direction="row" spacing={1} mt={1}>
                                <Button variant="contained" startIcon={<AddCircleIcon />} onClick={handleSave} fullWidth>
                                    {isEditing ? 'Update' : 'Save'}
                                </Button>
                                {isEditing && (
                                    <Button variant="outlined" onClick={resetForm}>Cancel</Button>
                                )}
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>

                {/* List Section */}
                <Grid item xs={12} md={7}>
                    <Stack spacing={2}>
                        {connections.length === 0 && <Alert severity="info">No connections in this workspace.</Alert>}
                        {connections.map(conn => (
                            <Card key={conn.id} variant="outlined">
                                <CardContent sx={{ pb: 1 }}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <StorageIcon color="action" />
                                            <Typography variant="subtitle1" fontWeight={600}>{conn.name}</Typography>
                                            <Chip label={conn.type} size="small" sx={{ height: 20, fontSize: '0.65rem' }}/>
                                        </Box>
                                        <Box>
                                            <IconButton size="small" onClick={() => handleEdit(conn)}><EditIcon fontSize="small"/></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(conn.id)}><DeleteIcon fontSize="small"/></IconButton>
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                        {conn.url}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}