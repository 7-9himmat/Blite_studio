import { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext'; // Update path as needed
import { 
    Typography, Paper, Button, Box, Divider, TextField, 
    FormControl, RadioGroup, FormControlLabel, Radio, 
    Alert, CircularProgress, Stack 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import StorageIcon from '@mui/icons-material/Storage';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';

// CHANGE 1: Accept 'source' prop instead of 'file'
export default function ScreenLoad({ source, rules }) { 
    // State for Sink Selection
    const [sinkType, setSinkType] = useState('JSON'); 
    const { activeWorkspace } = useWorkspace();
    
    // State for Database Config (Destination)
    const [dbConfig, setDbConfig] = useState({
        tableName: 'my_transformed_data',
        url: 'jdbc:postgresql://localhost:5432/blite_warehouse',
        user: 'blite_user',
        password: 'blite_password'
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); 

    const handleRunJob = async () => {
        // Validation check
        if (!source || (!source.payload && source.type === 'FILE')) {
            setStatus({ type: 'error', msg: "No source selected. Please go back to Step 1." });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            // 1. Construct the Job Config
            const jobConfig = {
                sourceType: source.type === 'FILE' ? 'CSV' : 'DB',
                // If DB, we inject the connection details from Step 1
                sourceConfig: source.type === 'DB' ? source.payload : {}, 
                rules: rules,
                sinkType: sinkType,
                sinkConfig: sinkType === 'POSTGRES' ? dbConfig : {},
                workspaceId: activeWorkspace ? activeWorkspace.id : null
            };

            // 2. Handle CSV Source (Multipart Upload)
            if (source.type === 'FILE') {
                const formData = new FormData();
                formData.append("file", source.payload); // The actual File object
                formData.append("jobConfig", JSON.stringify(jobConfig));

                if (sinkType === 'JSON') {
                    // Download flow
                    const res = await axios.post('http://localhost:8080/api/download', formData, { responseType: 'blob' });
                    triggerDownload(res.data);
                } else {
                    // DB Load flow
                    await axios.post('http://localhost:8080/api/execute', formData);
                    setStatus({ type: 'success', msg: `Data loaded into table: ${dbConfig.tableName}` });
                }
            } 
            // 3. Handle DB Source (JSON Request - No File)
            else if (source.type === 'DB') {
                // For DB-to-DB or DB-to-JSON, we just send JSON
                if (sinkType === 'JSON') {
                    // Backend needs to support generating a file from DB source (Advanced)
                    // For now, let's assume /execute handles it or show a limitation
                    alert("DB to JSON download requires backend update. Try DB to DB!");
                } else {
                    // DB to DB (The most common ETL case)
                    // We send JSON, not FormData, because there is no file to upload
                    await axios.post('http://localhost:8080/api/execute/db-job', jobConfig, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    setStatus({ type: 'success', msg: `Data moved from ${source.payload.name} to ${dbConfig.tableName}` });
                }
            }

        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: "Job failed. Check console." });
        } finally {
            setLoading(false);
        }
    };

    const triggerDownload = (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'processed_data.json');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setStatus({ type: 'success', msg: "File downloaded successfully." });
    };

    return (
        <Box maxWidth="800px">
            <Typography variant="h4" gutterBottom>Load Data</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Source: <strong>{source?.type === 'DB' ? `Database (${source.payload.name})` : `File (${source?.payload?.name || 'None'})`}</strong>
            </Typography>

            <Paper sx={{ p: 4 }}>
                {/* Destination Selector */}
                <Typography variant="h6" gutterBottom>Destination Type</Typography>
                <FormControl component="fieldset">
                    <RadioGroup row value={sinkType} onChange={(e) => setSinkType(e.target.value)}>
                        <FormControlLabel 
                            value="JSON" 
                            control={<Radio />} 
                            label={<Stack direction="row" gap={1} alignItems="center"><DownloadIcon color="action"/> JSON Download</Stack>} 
                            sx={{ mr: 4 }}
                        />
                        <FormControlLabel 
                            value="POSTGRES" 
                            control={<Radio />} 
                            label={<Stack direction="row" gap={1} alignItems="center"><StorageIcon color="primary"/> PostgreSQL DB</Stack>} 
                        />
                    </RadioGroup>
                </FormControl>

                <Divider sx={{ my: 4 }} />

                {/* DB Config Form */}
                {sinkType === 'POSTGRES' && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" color="primary" gutterBottom>Target Database</Typography>
                        <Stack spacing={3}>
                            <TextField 
                                label="Target Table Name" 
                                value={dbConfig.tableName}
                                onChange={(e) => setDbConfig({...dbConfig, tableName: e.target.value})}
                            />
                            <Stack direction="row" spacing={2}>
                                <TextField fullWidth label="JDBC URL" size="small" value={dbConfig.url} onChange={(e) => setDbConfig({...dbConfig, url: e.target.value})} />
                                <TextField label="User" size="small" value={dbConfig.user} onChange={(e) => setDbConfig({...dbConfig, user: e.target.value})} />
                                <TextField label="Pass" type="password" size="small" value={dbConfig.password} onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})} />
                            </Stack>
                        </Stack>
                    </Box>
                )}

                <Button 
                    variant="contained" size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <PlayArrowIcon />}
                    onClick={handleRunJob}
                    disabled={loading || !source}
                >
                    {loading ? "Processing..." : "Run Pipeline"}
                </Button>

                {status && <Alert severity={status.type} sx={{ mt: 3 }}>{status.msg}</Alert>}
            </Paper>
        </Box>
    );
}