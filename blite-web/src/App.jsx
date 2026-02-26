import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
    Box, CssBaseline, Drawer, List, ListItem, ListItemButton, 
    ListItemIcon, ListItemText, Typography, Chip, Divider, 
    FormControl, Select, MenuItem, Stack, CircularProgress,
    AppBar, Toolbar // <--- Added for Top Bar
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

// Icons
import SchemaRoundedIcon from "@mui/icons-material/SchemaRounded";
import BuildCircleRoundedIcon from "@mui/icons-material/BuildCircleRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import LinkIcon from "@mui/icons-material/Link";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import logo from "./assets/logo.png";

// Screens
import ScreenExtract from "./screens/ScreenExtract";
import ScreenTransform from "./screens/ScreenTransform";
import ScreenLoad from "./screens/ScreenLoad";
import ScreenQuery from "./screens/ScreenQuery";
import ScreenConnections from "./screens/ScreenConnections";
import ScreenJobs from "./screens/ScreenJobs";
import ScreenIntro from "./screens/ScreenIntro";
import ScreenSearch from "./screens/ScreenSearch"

// Components
import WorkspaceDialog from "./components/WorkspaceDialog";
import GlobalSearch from "./components/GlobalSearch"; // <--- Import Search
import ErrorBoundary from "./components/ErrorBoundary"; // <--- Import ErrorBoundary

// Context
import { WorkspaceProvider, useWorkspace } from "./context/WorkspaceContext";

const drawerWidth = 260;

function SidebarItem({ text, icon, path, active, comingSoon }) {
  return (
    <ListItem disablePadding sx={{ mb: 0.5, px: 1.5 }}>
      <ListItemButton
        component={Link}
        to={path}
        sx={{
          borderRadius: "6px",
          bgcolor: active ? "#EFF6FF" : "transparent",
          color: active ? "#2563EB" : "#64748B",
          "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: active ? "#2563EB" : "#94A3B8" }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: active ? 600 : 500 }}
        />
        {comingSoon && (
          <Chip label="Beta" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#F1F5F9" }} />
        )}
      </ListItemButton>
    </ListItem>
  );
}

// --- UPDATED LAYOUT WITH SEARCH BAR ---
function Layout({ children, onOpenCreate }) {
  const location = useLocation();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      <CssBaseline />

      {/* 1. TOP APP BAR (Holds the Search) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`, // Width = Total - Sidebar
          ml: `${drawerWidth}px`,                 // Push right by Sidebar width
          bgcolor: 'background.default',          // Match page background
          borderBottom: '1px solid #E2E8F0',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}> 
           {/* Center the Search Bar */}
           <Box sx={{ width: '100%', maxWidth: 600 }}>
               <GlobalSearch />
           </Box>
        </Toolbar>
      </AppBar>

      {/* 2. SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
          },
        }}
      >
        {/* Logo Area */}
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <img src={logo} alt="BLite Logo" style={{ height: 32, width: "auto" }} />
          <Typography variant="h5" sx={{ fontFamily: '"Inter", sans-serif', letterSpacing: "-0.5px", lineHeight: 1 }}>
            <span style={{ color: "#2563EB", fontWeight: 500 }}>BLite</span>
            <span style={{ color: "#94A3B8", fontWeight: 300 }}> Studio</span>
          </Typography>
        </Box>

        {/* Workspace Select */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 1, display: "block", fontSize: "0.7rem", fontWeight: 600 }}>
            WORKSPACE
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={activeWorkspace?.id || ""}
              onChange={(e) => {
                if (e.target.value === "NEW") onOpenCreate();
                else switchWorkspace(e.target.value);
              }}
              sx={{ bgcolor: "#F8FAFC", fontSize: "0.875rem", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" } }}
              displayEmpty
            >
              {workspaces.map((ws) => (
                <MenuItem key={ws.id} value={ws.id}>{ws.name}</MenuItem>
              ))}
              <Divider />
              <MenuItem value="NEW">
                <Stack direction="row" alignItems="center" gap={1} color="primary.main">
                  <AddIcon fontSize="small" />
                  <Typography variant="body2" fontWeight={600}>Create New...</Typography>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 2, mx: 3 }} />

        {/* Menu Items */}
        <List>
          <Typography variant="subtitle2" sx={{ px: 3, mb: 1, mt: 1 }}>Pipeline</Typography>
          <SidebarItem text="Extract Sources" icon={<SchemaRoundedIcon />} path="/" active={location.pathname === "/"} />
          <SidebarItem text="Transformations" icon={<BuildCircleRoundedIcon />} path="/transform" active={location.pathname === "/transform"} />
          <SidebarItem text="Load & Export" icon={<CloudUploadRoundedIcon />} path="/load" active={location.pathname === "/load"} />
          <SidebarItem text="Connections" icon={<LinkIcon />} path="/connections" active={location.pathname === "/connections"} />
          
          <Typography variant="subtitle2" sx={{ px: 3, mb: 1, mt: 3 }}>Analyze</Typography>
          <SidebarItem text="Worksheets" icon={<TerminalRoundedIcon />} path="/query" active={location.pathname === "/query"} />
          <SidebarItem text="Job History" icon={<HistoryIcon />} path="/jobs" active={location.pathname === "/jobs"} />
        </List>
      </Drawer>

      {/* 3. MAIN CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: "100%" }}>
        {/* This Toolbar acts as a spacer so content isn't hidden behind the fixed AppBar */}
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
}

function App() {
  const { workspaces, createWorkspace, loading } = useWorkspace(); 
  const [wsDialogOpen, setWsDialogOpen] = useState(false);

  // App State
  const [rules, setRules] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [source, setSource] = useState({ type: "FILE", payload: null });

  const handleCreateWorkspace = async (data) => {
    await createWorkspace(data);
    setWsDialogOpen(false);
  };

  if (loading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {workspaces.length === 0 ? (
          <ScreenIntro onCreateWorkspace={() => setWsDialogOpen(true)} />
        ) : (
          <Layout onOpenCreate={() => setWsDialogOpen(true)}>
            <Routes>
              <Route path="/" element={<ScreenExtract setPreviewData={setPreviewData} source={source} setSource={setSource} />} />
              <Route path="/transform" element={<ScreenTransform rules={rules} setRules={setRules} previewData={previewData} />} />
              <Route path="/load" element={<ScreenLoad source={source} rules={rules} />} />
              <Route path="/query" element={<ScreenQuery />} />
              <Route path="/connections" element={<ScreenConnections />} />
              <Route path="/jobs" element={<ScreenJobs />} />
              <Route path="/search" element={<ScreenSearch />} />
            </Routes>
          </Layout>
        )}

        <WorkspaceDialog
          open={wsDialogOpen}
          onClose={() => setWsDialogOpen(false)}
          onSave={handleCreateWorkspace}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function AppWrapper() {
  return (
    <WorkspaceProvider>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </WorkspaceProvider>
  );
}