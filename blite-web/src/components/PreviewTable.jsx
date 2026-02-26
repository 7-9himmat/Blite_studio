import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Typography 
} from '@mui/material';

export default function PreviewTable({ data }) {
    if (!data || data.length === 0) return null;

    // Get headers from the first row object
    const headers = Object.keys(data[0]);

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                // Fix the height to fill the parent container
                height: '100%', 
                maxHeight: '100%', 
                width: '100%',
                boxShadow: 'none', // Remove default shadow for cleaner look inside panels
                borderRadius: 0,
                // Enable scrolling
                overflow: 'auto'
            }}
        >
            <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell 
                                key={header}
                                sx={{ 
                                    fontWeight: 700, 
                                    bgcolor: '#F1F5F9', // Light gray header background
                                    color: '#334155',
                                    whiteSpace: 'nowrap', // Prevent header wrapping
                                    borderBottom: '2px solid #E2E8F0'
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow 
                            key={rowIndex} 
                            hover 
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {headers.map((header, colIndex) => (
                                <TableCell 
                                    key={`${rowIndex}-${colIndex}`}
                                    sx={{ 
                                        maxWidth: 300, // Prevent massive columns
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis',
                                        color: '#475569'
                                    }}
                                    title={formatCellData(row[header])} // Tooltip for full content
                                >
                                    {formatCellData(row[header])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// Helper to safely display objects/arrays/nulls
function formatCellData(value) {
    if (value === null || value === undefined) return <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>null</span>;
    if (typeof value === 'object') return JSON.stringify(value); // Handle JSON columns
    if (typeof value === 'boolean') return value.toString();
    return value;
}