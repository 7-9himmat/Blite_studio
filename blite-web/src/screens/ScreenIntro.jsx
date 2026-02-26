import { Box, Typography, Button, Paper, Stack, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchemaRoundedIcon from "@mui/icons-material/SchemaRounded";
import BuildCircleRoundedIcon from "@mui/icons-material/BuildCircleRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import logo from "../assets/logo.png"; 

export default function ScreenIntro({ onCreateWorkspace }) {
    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#F8FAFC', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 2
        }}>
            <Container maxWidth="md">
                <Paper elevation={0} sx={{ 
                    p: { xs: 4, md: 8 }, 
                    borderRadius: 4, 
                    textAlign: 'center',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                    bgcolor: '#FFFFFF'
                }}>
                    {/* --- Logo Section --- */}
                    <Box mb={5} display="flex" justifyContent="center" alignItems="center" gap={1.5}>
                        <img src={logo} alt="BLite Logo" style={{ height: 50 }} />
                        <Typography variant="h3" sx={{ fontFamily: '"Inter", sans-serif', letterSpacing: "-1.5px" }}>
                            <span style={{ color: "#2563EB", fontWeight: 700 }}>BLite</span>
                            <span style={{ color: "#94A3B8", fontWeight: 300 }}>Studio</span>
                        </Typography>
                    </Box>

                    {/* --- Headline --- */}
                    <Typography variant="h4" gutterBottom fontWeight={700} color="#1E293B">
                        Welcome to your Data Workspace
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 550, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        BLite Studio helps you extract, transform, and analyze your data in one seamless platform. 
                        Create a workspace to begin your journey.
                    </Typography>

                    {/* --- Features Cards (Fixed Layout) --- */}
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={3} 
                        mb={6} 
                        justifyContent="center"
                    >
                        <FeatureBox 
                            icon={<SchemaRoundedIcon fontSize="large" sx={{ color: '#2563EB' }}/>} 
                            title="Connect & Extract" 
                            desc="Connect to databases or upload CSVs easily." 
                        />
                        <FeatureBox 
                            icon={<BuildCircleRoundedIcon fontSize="large" sx={{ color: '#2563EB' }}/>} 
                            title="Transform" 
                            desc="Map, clean, and validate your data visually." 
                        />
                        <FeatureBox 
                            icon={<TerminalRoundedIcon fontSize="large" sx={{ color: '#2563EB' }}/>} 
                            title="Query & Analyze" 
                            desc="Run SQL queries with a smart, rich editor." 
                        />
                    </Stack>

                    {/* --- CTA Button --- */}
                    <Button 
                        variant="contained" 
                        size="large" 
                        startIcon={<AddIcon />}
                        onClick={onCreateWorkspace}
                        sx={{ 
                            py: 1.8, 
                            px: 5, 
                            fontSize: '1rem', 
                            fontWeight: 600,
                            borderRadius: '12px', 
                            textTransform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            '&:hover': {
                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                            }
                        }}
                    >
                        Create My First Workspace
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}

// Sub-component for the cards
function FeatureBox({ icon, title, desc }) {
    return (
        <Box sx={{ 
            flex: 1, // Ensures all cards are equal width
            p: 3, 
            bgcolor: '#F8FAFC', 
            borderRadius: 3, 
            border: '1px solid #F1F5F9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: '#E2E8F0'
            }
        }}>
            <Box sx={{ 
                p: 1.5, 
                bgcolor: '#EFF6FF', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 1 
            }}>
                {icon}
            </Box>
            <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                {desc}
            </Typography>
        </Box>
    );
}