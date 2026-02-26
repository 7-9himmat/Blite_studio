import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, FormControl, InputLabel, Select, MenuItem, Stack 
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function ConnectionDialog({ open, handleClose, handleSave, initialData }) {
    const [formData, setFormData] = useState({
        name: '', type: 'POSTGRES', url: '', username: '', password: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', type: 'POSTGRES', url: 'jdbc:postgresql://<host>:5432/db', username: '', password: '' });
        }
    }, [initialData, open]);

    const onSave = () => {
        handleSave(formData);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Edit Connection' : 'New Connection'}</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField 
                        label="Connection Name" fullWidth autoFocus
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Database Type</InputLabel>
                        <Select 
                            value={formData.type} label="Database Type"
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <MenuItem value="POSTGRES">PostgreSQL</MenuItem>
                            <MenuItem value="MYSQL">MySQL</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField 
                        label="JDBC URL" fullWidth
                        value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField 
                            label="Username" fullWidth
                            value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        <TextField 
                            label="Password" type="password" fullWidth
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={onSave} disabled={!formData.name}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}