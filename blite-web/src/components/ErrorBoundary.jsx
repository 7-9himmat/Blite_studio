import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); // Hard refresh to clear bad state
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
            sx={{ 
                height: '100vh', 
                bgcolor: '#F8FAFC', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2 
            }}
        >
            <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 4, border: '1px solid #E2E8F0' }}>
                <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Something went wrong
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                    The application encountered an unexpected error. 
                    We have logged this issue.
                </Typography>
                
                {/* Optional: Show technical error details in Dev mode */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                    <Box sx={{ 
                        mt: 2, mb: 4, p: 2, bgcolor: '#FEF2F2', 
                        borderRadius: 2, textAlign: 'left', overflow: 'auto', maxHeight: 200 
                    }}>
                        <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', color: '#DC2626' }}>
                            {this.state.error.toString()}
                        </Typography>
                    </Box>
                )}

                <Button 
                    variant="contained" 
                    startIcon={<RefreshIcon />} 
                    onClick={this.handleReset}
                >
                    Reload Application
                </Button>
            </Paper>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;