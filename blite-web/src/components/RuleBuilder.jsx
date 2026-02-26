import { useState } from 'react';
import { 
    Paper, Typography, Box, TextField, MenuItem, Button, Chip, Stack, IconButton 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const RuleBuilder = ({ onRulesChange }) => {
    const [rules, setRules] = useState([]);
    
    // Temporary state for the "New Rule" inputs
    const [type, setType] = useState('UPPERCASE');
    const [field, setField] = useState('');
    const [value, setValue] = useState('');

    const addRule = () => {
        if (!field) return; // Field is mandatory
        
        const newRule = { type, field, value };
        const updatedRules = [...rules, newRule];
        
        setRules(updatedRules);
        onRulesChange(updatedRules); // Notify Parent
        
        // Reset inputs
        setField('');
        setValue('');
    };

    const removeRule = (index) => {
        const updatedRules = rules.filter((_, i) => i !== index);
        setRules(updatedRules);
        onRulesChange(updatedRules);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom>
                Configure Transformations
            </Typography>
            
            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField 
                    select 
                    label="Rule Type" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    size="small"
                    sx={{ width: 150 }}
                >
                    <MenuItem value="UPPERCASE">Uppercase</MenuItem>
                    <MenuItem value="FILTER">Filter (Keep)</MenuItem>
                </TextField>

                <TextField 
                    label="Column Name" 
                    value={field} 
                    onChange={(e) => setField(e.target.value)}
                    size="small"
                    placeholder="e.g. name"
                />

                {type === 'FILTER' && (
                    <TextField 
                        label="Value to Keep" 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)}
                        size="small"
                        placeholder="e.g. Manager"
                    />
                )}

                <Button 
                    variant="contained" 
                    startIcon={<AddCircleIcon />} 
                    onClick={addRule}
                >
                    Add
                </Button>
            </Box>

            {/* List of Active Rules */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {rules.map((rule, idx) => (
                    <Chip
                        key={idx}
                        label={`${rule.type} on '${rule.field}' ${rule.value ? `== ${rule.value}` : ''}`}
                        onDelete={() => removeRule(idx)}
                        color="secondary"
                        variant="outlined"
                        deleteIcon={<DeleteIcon />}
                    />
                ))}
                {rules.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        No rules added. Data will be passed through raw.
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
};

export default RuleBuilder;