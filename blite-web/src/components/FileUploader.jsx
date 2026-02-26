import { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from '@mui/icons-material/Download'; // Import this

const FileUploader = ({ onDataReceived, currentRules }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false); 
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Convert rules array to JSON Blob so Spring @RequestPart can read it
    const jsonRules = JSON.stringify(currentRules);
    const blob = new Blob([jsonRules], { type: "application/json" });
    formData.append("config", blob); // Key must match Java @RequestPart("config")

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/preview",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      onDataReceived(response.data);
    } catch (err) {
      setError("Failed to connect to ETL Engine. Is Java running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
        if (!file) return;
        
        const formData = new FormData();
        formData.append("file", file);
        const jsonRules = JSON.stringify(currentRules);
        const blob = new Blob([jsonRules], { type: 'application/json' });
        formData.append("config", blob);

        setDownloading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/download', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob' // IMPORTANT: This tells Axios to handle binary data
            });

            // Create a virtual link to trigger the browser download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'processed_data.json'); // File name
            document.body.appendChild(link);
            link.click();
            link.remove(); // Cleanup

        } catch (err) {
            setError("Download failed. Check backend logs.");
            console.error(err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" gutterBottom color="primary">
                    3. Run Pipeline
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload a CSV to preview or download the full transformed JSON.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {/* File Selection */}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                    >
                        {file ? file.name : "Select CSV Source"}
                        <input type="file" hidden accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
                    </Button>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="contained" 
                            onClick={() => handleUpload()} // Calls your existing preview logic
                            disabled={!file || loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Preview (5 Rows)"}
                        </Button>

                        <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            disabled={!file || downloading}
                        >
                             {downloading ? <CircularProgress size={24} color="inherit" /> : "Download JSON"}
                        </Button>
                    </Stack>
                </Box>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </CardContent>
        </Card>
    );
};

export default FileUploader;