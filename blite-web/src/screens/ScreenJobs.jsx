import { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, 
    Alert, CircularProgress 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import axios from 'axios';
import { useWorkspace } from '../context/WorkspaceContext';

export default function ScreenJobs() {
    const { activeWorkspace } = useWorkspace();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchJobs = () => {
        if (!activeWorkspace) return;
        setLoading(true);
        axios.get(`http://localhost:8080/api/jobs?workspaceId=${activeWorkspace.id}`)
            .then(res => setJobs(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchJobs();
        // Optional: Auto-refresh every 5 seconds to check for updates
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, [activeWorkspace]);

    const getStatusChip = (status) => {
        switch(status) {
            case 'SUCCESS': return <Chip icon={<CheckCircleIcon/>} label="Success" color="success" size="small" variant="outlined"/>;
            case 'FAILED': return <Chip icon={<ErrorIcon/>} label="Failed" color="error" size="small" variant="outlined"/>;
            case 'RUNNING': return <Chip icon={<PlayCircleFilledIcon/>} label="Running" color="primary" size="small" variant="outlined"/>;
            default: return <Chip label={status} size="small"/>;
        }
    };

    return (
        <Box maxWidth="1200px">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Job History</Typography>
                <IconButton onClick={fetchJobs} disabled={loading}>
                    <RefreshIcon spin={loading} />
                </IconButton>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Start Time</strong></TableCell>
                            <TableCell><strong>Source</strong></TableCell>
                            <TableCell><strong>Destination</strong></TableCell>
                            <TableCell><strong>Rows</strong></TableCell>
                            <TableCell><strong>Details</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    No jobs run in this workspace yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {jobs.map((job) => (
                            <TableRow key={job.id} hover>
                                <TableCell>{getStatusChip(job.status)}</TableCell>
                                <TableCell>{new Date(job.startTime).toLocaleString()}</TableCell>
                                <TableCell>{job.sourceType}</TableCell>
                                <TableCell>{job.sinkType}</TableCell>
                                <TableCell>{job.rowsProcessed > 0 ? job.rowsProcessed : '-'}</TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    {job.status === 'FAILED' ? (
                                        <Typography variant="caption" color="error">{job.errorMessage}</Typography>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Completed in {job.endTime ? ((new Date(job.endTime) - new Date(job.startTime))/1000).toFixed(1) + 's' : '...'}</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}