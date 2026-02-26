import { Typography, Grid, Paper, Box } from '@mui/material';
import RuleBuilder from '../components/RuleBuilder'; // Reusing your existing component
import PreviewTable from '../components/PreviewTable'; // Reusing your existing component

export default function ScreenTransform({ rules, setRules, previewData }) {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Transform Logic</Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    {/* Left Col: Rules */}
                    <RuleBuilder onRulesChange={setRules} />
                </Grid>
                
                <Grid item xs={12} md={8}>
                    {/* Right Col: Live Preview */}
                    <Paper sx={{ p: 2, minHeight: 400 }}>
                         <Typography variant="h6" gutterBottom>Data Preview</Typography>
                         {/* Note: Real-time preview requires re-sending the file + rules 
                            to backend. For now, we show the static raw data.
                            Future: Add a "Refresh Preview" button here.
                         */}
                         <PreviewTable data={previewData} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}