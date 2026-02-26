import { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Tab, Tabs, Button, Card, CardContent, 
    Stack, Chip, Alert, Link as MuiLink 
} from '@mui/material';
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import Papa from 'papaparse'; 
import { useWorkspace } from '../context/WorkspaceContext'; // <--- Import Context

export default function ScreenExtract({ setSource, source, setPreviewData }) {
    const { activeWorkspace } = useWorkspace(); // <--- Get Context
    const [tabIndex, setTabIndex] = useState(0); 
    const [connections, setConnections] = useState([]);
    const [selectedConnId, setSelectedConnId] = useState(null);

    useEffect(() => {
        if (activeWorkspace) {
            axios.get(`http://localhost:8080/api/connections?workspaceId=${activeWorkspace.id}`)
                 .then(res => setConnections(res.data))
                 .catch(err => console.error(err));
        }
    }, [activeWorkspace]);

    const handleSelectConnection = (conn) => {
        setSelectedConnId(conn.id);
        setSource({ type: 'DB', payload: conn });
        setPreviewData([]); 
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSource({ type: 'FILE', payload: file });
            Papa.parse(file, {
                header: true, preview: 5, skipEmptyLines: true,
                complete: (results) => setPreviewData(results.data)
            });
        }
    };

    return (
        <Box maxWidth="900px">
            <Typography variant="h4" gutterBottom>Extract Source</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Choose your data origin.</Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} textColor="primary" indicatorColor="primary" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<CloudUploadIcon />} label="CSV File" iconPosition="start" />
                    <Tab icon={<StorageIcon />} label="Database Source" iconPosition="start" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box sx={{ p: 5, textAlign: 'center' }}>
                        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ p: 4, borderStyle: 'dashed', borderWidth: 2, width: '100%', mb: 2 }}>
                            Click to Upload CSV
                            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                        </Button>
                        {source.type === 'FILE' && source.payload && (
                            <Alert severity="success">Selected File: <strong>{source.payload.name}</strong></Alert>
                        )}
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" mb={2}>
                            <Typography variant="h6">Available Connections ({activeWorkspace?.name})</Typography>
                            <Button component={Link} to="/connections" size="small">Manage Connections</Button>
                        </Stack>

                        <Stack spacing={2}>
                            {connections.length === 0 && (
                                <Alert severity="info">No connections found in {activeWorkspace?.name}. <MuiLink component={Link} to="/connections">Create one here.</MuiLink></Alert>
                            )}
                            
                            {connections.map((conn) => (
                                <Card key={conn.id} variant="outlined" onClick={() => handleSelectConnection(conn)} sx={{ cursor: 'pointer', borderColor: selectedConnId === conn.id ? 'primary.main' : 'divider', bgcolor: selectedConnId === conn.id ? 'primary.50' : 'background.paper', position: 'relative' }}>
                                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <StorageIcon color={selectedConnId === conn.id ? 'primary' : 'disabled'} />
                                            <Box flexGrow={1}>
                                                <Typography fontWeight={600}>{conn.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{conn.url}</Typography>
                                            </Box>
                                            <Chip label={conn.type} size="small" />
                                        </Stack>
                                    </CardContent>
                                    {selectedConnId === conn.id && <CheckCircleIcon color="primary" sx={{ position: 'absolute', top: 15, right: -10, opacity: 0 }} />}
                                </Card>
                            ))}
                        </Stack>
                        {source.type === 'DB' && selectedConnId && <Alert severity="success" sx={{ mt: 3 }}>Connection Active. Proceed to Transformation.</Alert>}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}