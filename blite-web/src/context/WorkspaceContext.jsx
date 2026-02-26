import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkspaces = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/workspaces');
            setWorkspaces(res.data);
            // Default to first workspace if none selected
            if (res.data.length > 0 && !activeWorkspace) {
                setActiveWorkspace(res.data[0]);
            }
        } catch (err) {
            console.error("Failed to load workspaces", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const switchWorkspace = (workspaceId) => {
        const found = workspaces.find(w => w.id === workspaceId);
        if (found) setActiveWorkspace(found);
    };

    const createWorkspace = async (workspaceData) => {
        try {
            // 1. Capture the response (which now contains the new UUID)
            const res = await axios.post('http://localhost:8080/api/workspaces', workspaceData);
            const newWorkspace = res.data; 

            // 2. Refresh the list (so it appears in the dropdown)
            // We await this to ensure the list is ready before we switch
            await fetchWorkspaces();
            
            // 3. AUTO-SWITCH: Set the new workspace as active immediately
            if (newWorkspace && newWorkspace.id) {
                setActiveWorkspace(newWorkspace);
            }

        } catch (err) {
            console.error("Failed to create workspace", err);
            throw err;
        }
    };

    return (
        <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, switchWorkspace, fetchWorkspaces, createWorkspace, loading }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);