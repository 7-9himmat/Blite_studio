import { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button 
} from '@mui/material';

export default function WorkspaceDialog({ open, onClose, onSave }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const handleSave = () => {
        onSave({ name, description: desc });
        setName('');
        setDesc('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>New Workspace</DialogTitle>
            <DialogContent>
                <TextField 
                    autoFocus margin="dense" label="Workspace Name" fullWidth 
                    value={name} onChange={(e) => setName(e.target.value)}
                />
                <TextField 
                    margin="dense" label="Description" fullWidth multiline rows={2}
                    value={desc} onChange={(e) => setDesc(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={!name}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}