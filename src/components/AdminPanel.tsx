import React, { useState, useEffect } from 'react';
import { 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getLocalSubmissions, 
  saveLocalSubmissions, 
  LeadSubmission, 
  GoogleSpreadsheet, 
  listGoogleSpreadsheets, 
  createNexoraSpreadsheet, 
  getActiveSheetId, 
  saveActiveSheetId,
  overwriteSheetWithSubmissions,
  readSubmissionsFromSheet
} from '../lib/googleSheets';
import { 
  Lock, 
  Unlock, 
  Database, 
  RefreshCw, 
  Plus, 
  Check, 
  LogOut, 
  ExternalLink, 
  FileSpreadsheet, 
  AlertTriangle, 
  Mail, 
  FileText, 
  ChevronDown, 
  Calendar, 
  Sliders,
  CheckCircle2,
  Trash2,
  Sparkles
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [submissions, setSubmissions] = useState<LeadSubmission[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const [isLoadingSpreadsheets, setIsLoadingSpreadsheets] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'sheets'>('submissions');
  const [newSheetName, setNewSheetName] = useState('Nexora Leads & Commissions');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);

  // Load submissions and active sheet from storage on load
  useEffect(() => {
    setSubmissions(getLocalSubmissions());
    setActiveSheetId(getActiveSheetId());

    // Listen for auth state
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync state whenever local storage changes or sync completes
  const refreshLocalSubmissions = () => {
    setSubmissions(getLocalSubmissions());
  };

  // Trigger Google Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setSyncMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setSyncMessage({ text: `Authenticated successfully as ${result.user.email}`, type: 'success' });
        
        // Auto load spreadsheets
        fetchSpreadsheets(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setSyncMessage({ text: err.message || 'Google Authentication failed', type: 'error' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Log out
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setSpreadsheets([]);
    setSyncMessage({ text: 'Logged out successfully', type: 'info' });
  };

  // Fetch spreadsheets
  const fetchSpreadsheets = async (accessToken?: string) => {
    const currentToken = accessToken || token;
    if (!currentToken) return;

    setIsLoadingSpreadsheets(true);
    try {
      const list = await listGoogleSpreadsheets(currentToken);
      setSpreadsheets(list);
    } catch (err: any) {
      console.error('Error fetching sheets:', err);
      setSyncMessage({ text: 'Failed to retrieve spreadsheets from Google Drive', type: 'error' });
    } finally {
      setIsLoadingSpreadsheets(false);
    }
  };

  // Create new Nexora sheet
  const handleCreateSheet = async () => {
    if (!token) return;
    setIsCreatingSheet(true);
    setSyncMessage(null);
    try {
      const newId = await createNexoraSpreadsheet(token, newSheetName);
      setActiveSheetId(newId);
      saveActiveSheetId(newId);
      setSyncMessage({ text: `Successfully created and linked spreadsheet: "${newSheetName}"`, type: 'success' });
      await fetchSpreadsheets();
      
      // Auto-upload local submissions to the fresh sheet!
      if (submissions.length > 0) {
        setIsSyncing(true);
        await overwriteSheetWithSubmissions(token, newId, submissions);
        const updated = submissions.map(s => ({ ...s, synced: true }));
        setSubmissions(updated);
        saveLocalSubmissions(updated);
        setIsSyncing(false);
        setSyncMessage({ text: `Spreadsheet created and ${submissions.length} local lead(s) successfully synchronized!`, type: 'success' });
      }
    } catch (err: any) {
      console.error('Error creating sheet:', err);
      setSyncMessage({ text: err.message || 'Failed to create spreadsheet', type: 'error' });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Select spreadsheet to link
  const handleSelectSheet = (id: string) => {
    setActiveSheetId(id);
    saveActiveSheetId(id);
    setSyncMessage({ text: 'Spreadsheet connection linked successfully', type: 'success' });
  };

  // Disconnect spreadsheet
  const handleDisconnectSheet = () => {
    const confirmDisconnect = window.confirm('Are you sure you want to disconnect this Google Sheet? Your local submissions list will remain untouched.');
    if (!confirmDisconnect) return;
    setActiveSheetId(null);
    saveActiveSheetId(null);
    setSyncMessage({ text: 'Spreadsheet connection unlinked', type: 'info' });
  };

  // Push local submissions to Google Sheet (overwrites Sheet for perfect alignment)
  const handlePushToSheet = async () => {
    if (!token || !activeSheetId) return;
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      await overwriteSheetWithSubmissions(token, activeSheetId, submissions);
      const updated = submissions.map(s => ({ ...s, synced: true }));
      setSubmissions(updated);
      saveLocalSubmissions(updated);
      setSyncMessage({ text: `${submissions.length} leads successfully synchronized and updated in Google Sheets!`, type: 'success' });
    } catch (err: any) {
      console.error('Sync error:', err);
      setSyncMessage({ text: err.message || 'Synchronization failed', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull submissions from Google Sheet
  const handlePullFromSheet = async () => {
    if (!token || !activeSheetId) return;
    const confirmPull = window.confirm('This will import all data from the active Google Sheet. To avoid duplicating entries, ensure your spreadsheet matches your local logs. Proceed?');
    if (!confirmPull) return;

    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const imported = await readSubmissionsFromSheet(token, activeSheetId);
      if (imported.length === 0) {
        setSyncMessage({ text: 'Google Sheet is empty or headers-only. No records imported.', type: 'info' });
      } else {
        // Merge or replace
        setSubmissions(imported);
        saveLocalSubmissions(imported);
        setSyncMessage({ text: `Import completed! Successfully loaded ${imported.length} leads from Google Sheets.`, type: 'success' });
      }
    } catch (err: any) {
      console.error('Pull error:', err);
      setSyncMessage({ text: err.message || 'Failed to pull data from Google Sheet', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Update a lead's status or notes
  const handleUpdateLead = (id: string, updates: Partial<LeadSubmission>) => {
    const updated = submissions.map(lead => {
      if (lead.id === id) {
        const leadCopy = { ...lead, ...updates, synced: false };
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(leadCopy);
        }
        return leadCopy;
      }
      return lead;
    });
    setSubmissions(updated);
    saveLocalSubmissions(updated);
  };

  // Delete lead locally
  const handleDeleteLead = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this lead? This will remove it from the local list. To reflect this on your linked Google Sheet, remember to click Sync afterward.');
    if (!confirmDelete) return;

    const filtered = submissions.filter(lead => lead.id !== id);
    setSubmissions(filtered);
    saveLocalSubmissions(filtered);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(null);
    }
  };

  // Clear all local leads
  const handleClearAllLeads = () => {
    const confirmClear = window.confirm('DANGER: This will permanently delete all local lead submissions. This cannot be undone. Proceed?');
    if (!confirmClear) return;

    setSubmissions([]);
    saveLocalSubmissions([]);
    setSelectedLead(null);
    setSyncMessage({ text: 'All local database logs cleared', type: 'info' });
  };

  const getStatusColor = (status: LeadSubmission['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'In Contact': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      case 'Proposal': return 'bg-pink-500/10 border-pink-500/30 text-pink-400';
      case 'Active Project': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Completed': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'Archived': return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const activeSheetName = spreadsheets.find(s => s.id === activeSheetId)?.name || 'Unknown spreadsheet';

  return (
    <div className="mt-16 border border-white/10 bg-[#0E1318]/90 overflow-hidden relative" id="sheets-integration-panel">
      {/* Glow Effect */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Panel Trigger Bar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) refreshLocalSubmissions();
        }}
        className="w-full flex items-center justify-between p-6 bg-[#0E1318] border-b border-white/5 hover:bg-white/[0.02] transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4 text-left">
          <div className={`w-10 h-10 flex items-center justify-center border ${isOpen ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-gray-400'} transition-colors`}>
            {isOpen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase font-mono">Nexora Database</div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-display">
              Google Sheets Sync & Admin Command Center
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Connected Sheets
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Main Panel Content (Collapsible) */}
      {isOpen && (
        <div className="p-6 md:p-8 animate-fade-in">
          
          {/* Header Actions / OAuth State Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5 mb-8">
            <div className="flex flex-col gap-1">
              <h5 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                Connection Parameters
              </h5>
              <p className="text-[11px] text-white/40">
                Authenticate with Google Drive & Sheets to activate real-time synchronization.
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="flex flex-wrap items-center gap-3">
              {!user ? (
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-emerald-500/30 text-white font-bold text-[10px] tracking-widest uppercase font-mono transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  {isLoggingIn ? 'AUTHENTICATING...' : 'SIGN IN WITH GOOGLE'}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider">ADMIN CONNECTED</span>
                    <span className="text-[9px] text-white/40">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 border border-white/5 bg-white/2 hover:bg-red-500/10 hover:border-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    title="Log Out Secure Connection"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Inline Alert Messages */}
          {syncMessage && (
            <div className={`p-4 mb-6 border text-[11px] font-mono tracking-wider flex items-start gap-3 animate-fade-in ${
              syncMessage.type === 'success' 
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' 
                : syncMessage.type === 'error'
                  ? 'bg-red-950/20 border-red-500/20 text-red-400'
                  : 'bg-blue-950/20 border-blue-500/20 text-blue-400'
            }`}>
              {syncMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold uppercase block mb-0.5">{syncMessage.type} RESPONSE LOGGED</span>
                {syncMessage.text}
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT TABBED WORKSPACE: Submissions List or Sheet Select (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              
              {/* Tab Toggles */}
              <div className="flex border-b border-white/5 bg-[#080B0F] p-1">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase font-mono border-t-2 transition-all focus:outline-none ${
                    activeTab === 'submissions'
                      ? 'border-[#D4AF37] text-white bg-white/[0.02]'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Submissions Log ({submissions.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('sheets');
                    if (user && token && spreadsheets.length === 0) {
                      fetchSpreadsheets();
                    }
                  }}
                  className={`flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase font-mono border-t-2 transition-all focus:outline-none ${
                    activeTab === 'sheets'
                      ? 'border-[#D4AF37] text-white bg-white/[0.02]'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Linked Spreadsheet Config
                </button>
              </div>

              {/* Tab A: Submissions list */}
              {activeTab === 'submissions' && (
                <div className="flex flex-col gap-4">
                  {/* Local Controls */}
                  <div className="flex justify-between items-center bg-[#0B0F14] border border-white/5 p-4">
                    <span className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      LOCAL SQLITE CACHE
                    </span>
                    <div className="flex items-center gap-2">
                      {submissions.length > 0 && (
                        <button
                          onClick={handleClearAllLeads}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/5 hover:text-red-300 font-bold text-[9px] tracking-wider uppercase font-mono transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Purge Logs
                        </button>
                      )}
                      
                      {token && activeSheetId && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePushToSheet}
                            disabled={isSyncing || submissions.length === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold text-[9px] tracking-wider uppercase font-mono transition-all disabled:opacity-40"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                            Sync to Sheet
                          </button>
                          <button
                            onClick={handlePullFromSheet}
                            disabled={isSyncing}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-[9px] tracking-wider uppercase font-mono transition-all"
                            title="Import/Pull rows from connected Spreadsheet"
                          >
                            Import Sheet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Cards Grid */}
                  {submissions.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
                      <Mail className="w-8 h-8 text-white/20 animate-pulse" />
                      <div className="text-xs font-semibold text-white/50 uppercase font-mono tracking-widest">
                        Database Logs Empty
                      </div>
                      <p className="text-[10px] text-white/30 max-w-xs leading-relaxed">
                        No submissions logged yet. Use the contact form above to write test briefs.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                      {submissions.map((lead) => (
                        <div 
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-4 border transition-all duration-300 flex items-center justify-between cursor-pointer group text-left ${
                            selectedLead?.id === lead.id 
                              ? 'bg-emerald-950/10 border-emerald-500/40' 
                              : 'bg-[#0B0F14]/70 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Sync Status Badge */}
                            <div className={`w-2 h-10 flex-shrink-0 ${lead.synced ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} title={lead.synced ? 'Synced' : 'Requires Sync'} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider font-display truncate">
                                  {lead.name}
                                </span>
                                <span className={`px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase border ${getStatusColor(lead.status)}`}>
                                  {lead.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 text-[9px] font-mono text-white/45">
                                <span className="truncate">{lead.email}</span>
                                <span>•</span>
                                <span className="truncate max-w-[200px]">{lead.subject || 'No Subject'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-[9px] font-mono text-white/30 hidden sm:inline">
                              {new Date(lead.timestamp).toLocaleDateString()}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab B: Google Sheet Config */}
              {activeTab === 'sheets' && (
                <div className="flex flex-col gap-5">
                  {!user ? (
                    <div className="py-12 text-center border border-dashed border-white/10 flex flex-col items-center justify-center gap-4">
                      <Lock className="w-8 h-8 text-[#D4AF37]/40" />
                      <div className="text-xs font-semibold text-white/50 uppercase font-mono tracking-widest">
                        Authentication Required
                      </div>
                      <p className="text-[11px] text-white/30 max-w-sm leading-relaxed px-4">
                        Please sign in with Google above to scan your Drive files, create sheets, and link submission records.
                      </p>
                      <button
                        onClick={handleLogin}
                        className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#115e59] text-white font-bold text-[10px] tracking-widest uppercase font-mono transition-all"
                      >
                        Sign In Now
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      
                      {/* Active Connected Spreadsheet info */}
                      <div className="p-5 bg-emerald-950/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase font-mono">ACTIVE SPREADSHEET LINK</div>
                            <h6 className="text-xs font-semibold text-white mt-0.5">
                              {activeSheetId ? activeSheetName : 'No spreadsheet linked'}
                            </h6>
                            {activeSheetId && (
                              <a 
                                href={`https://docs.google.com/spreadsheets/d/${activeSheetId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-[#D4AF37] hover:underline inline-flex items-center gap-1 mt-1 font-mono uppercase"
                              >
                                Open Spreadsheet Webpage <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {activeSheetId && (
                          <button
                            onClick={handleDisconnectSheet}
                            className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/5 text-[9px] font-bold uppercase font-mono tracking-wider transition-all"
                          >
                            Unlink Connection
                          </button>
                        )}
                      </div>

                      {/* Create New Sheet section */}
                      <div className="p-5 border border-white/5 bg-[#0B0F14]">
                        <h6 className="text-xs font-semibold text-white mb-2 tracking-wide uppercase font-display flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-[#D4AF37]" />
                          Create New Submissions Spreadsheet
                        </h6>
                        <p className="text-[11px] text-white/40 mb-4">
                          Generate a beautifully pre-formatted spreadsheet in your Google Drive with column headers matching Nexora.
                        </p>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newSheetName}
                            onChange={(e) => setNewSheetName(e.target.value)}
                            placeholder="Nexora Leads & Commissions"
                            className="flex-1 px-4 py-2.5 bg-[#080B0F] border border-white/10 text-white placeholder-white/20 text-xs outline-none focus:border-[#D4AF37] transition-all"
                          />
                          <button
                            onClick={handleCreateSheet}
                            disabled={isCreatingSheet}
                            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold text-[10px] tracking-widest uppercase font-mono transition-all flex items-center gap-2 disabled:opacity-55"
                          >
                            {isCreatingSheet ? 'CREATING...' : 'PROVISION SHEET'}
                          </button>
                        </div>
                      </div>

                      {/* Select existing Spreadsheet list */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-xs font-semibold text-white tracking-wide uppercase font-display">
                            Available Google Spreadsheets
                          </h6>
                          <button
                            onClick={() => fetchSpreadsheets()}
                            disabled={isLoadingSpreadsheets}
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider font-mono inline-flex items-center gap-1"
                          >
                            <RefreshCw className={`w-3 h-3 ${isLoadingSpreadsheets ? 'animate-spin' : ''}`} />
                            Refresh Drive Files
                          </button>
                        </div>

                        {isLoadingSpreadsheets ? (
                          <div className="py-12 text-center border border-white/5 flex flex-col items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] text-white/40 font-mono uppercase mt-1">Scanning Google Drive...</span>
                          </div>
                        ) : spreadsheets.length === 0 ? (
                          <div className="py-8 text-center border border-dashed border-white/5 text-[11px] text-white/30 font-mono uppercase">
                            No spreadsheets found in Drive.
                          </div>
                        ) : (
                          <div className="border border-white/5 max-h-[220px] overflow-y-auto divide-y divide-white/5 bg-[#0B0F14]/40">
                            {spreadsheets.map((sheet) => (
                              <div 
                                key={sheet.id}
                                className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                              >
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-white truncate">{sheet.name}</div>
                                  <div className="text-[9px] text-white/30 font-mono mt-0.5">
                                    Modified: {new Date(sheet.modifiedTime).toLocaleDateString()}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleSelectSheet(sheet.id)}
                                  disabled={activeSheetId === sheet.id}
                                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider font-mono transition-all ${
                                    activeSheetId === sheet.id
                                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                                      : 'border border-white/10 text-gray-300 hover:border-emerald-500 hover:text-white'
                                  }`}
                                >
                                  {activeSheetId === sheet.id ? 'CONNECTED' : 'CONNECT'}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR: Selected Lead Details (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4 border border-white/5 bg-[#080B0F] p-5">
              <h5 className="text-xs font-bold text-white tracking-widest uppercase font-mono flex items-center gap-2 mb-2 border-b border-white/5 pb-2.5">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                Diagnostic Inspector
              </h5>

              {!selectedLead ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-2.5">
                  <Database className="w-6 h-6 text-white/10" />
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                    No lead selected
                  </span>
                  <p className="text-[9px] text-white/20 max-w-[180px] leading-relaxed mx-auto">
                    Click any card in the log list to inspect mechanical/digital requirements.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-left">
                  {/* Lead metadata card */}
                  <div>
                    <div className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase">CLIENT NAME</div>
                    <div className="text-sm font-bold text-white tracking-wide uppercase font-display mt-0.5">{selectedLead.name}</div>
                  </div>

                  <div>
                    <div className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase">EMAIL ADDRESS</div>
                    <a href={`mailto:${selectedLead.email}`} className="text-xs font-semibold text-[#D4AF37] hover:underline block mt-0.5">
                      {selectedLead.email}
                    </a>
                  </div>

                  <div>
                    <div className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase">COMMISSION TIMESTAMP</div>
                    <div className="text-xs text-white/60 font-mono mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {new Date(selectedLead.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase">PROJECT SUBJECT</div>
                    <div className="text-xs font-semibold text-white/80 mt-0.5">{selectedLead.subject || 'General CAD inquiry'}</div>
                  </div>

                  <div>
                    <div className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase">BRIEF MESSAGE</div>
                    <div className="text-xs text-white/70 leading-relaxed mt-1 p-3 bg-white/[0.01] border border-white/5 max-h-[140px] overflow-y-auto whitespace-pre-wrap font-sans">
                      {selectedLead.message}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex flex-col gap-3.5">
                    
                    {/* Status Select dropdown */}
                    <div>
                      <label className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase block mb-1.5">WORKFLOW STATUS</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value as LeadSubmission['status'] })}
                        className="w-full px-3 py-2 bg-[#0E1318] border border-white/10 text-white font-mono text-xs outline-none focus:border-emerald-500 transition-all rounded-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Contact">In Contact</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Active Project">Active Project</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    {/* Admin remarks text area */}
                    <div>
                      <label className="text-[8px] font-bold text-white/30 font-mono tracking-widest uppercase block mb-1.5">ADMIN REMARKS & NOTES</label>
                      <textarea
                        value={selectedLead.notes}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { notes: e.target.value })}
                        placeholder="Log quotes, dimensions, deadlines, or client details here..."
                        rows={3}
                        className="w-full px-3 py-2 bg-[#0E1318] border border-white/10 text-white text-xs outline-none focus:border-emerald-500 transition-all resize-none rounded-none"
                      />
                    </div>

                    {/* Actions bar for Lead */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3.5">
                      <button
                        onClick={() => handleDeleteLead(selectedLead.id)}
                        className="px-2.5 py-1.5 border border-red-500/10 text-red-400/80 hover:bg-red-500/5 hover:text-red-400 text-[9px] font-bold uppercase font-mono tracking-widest transition-all"
                      >
                        Delete Lead
                      </button>

                      {selectedLead.synced ? (
                        <span className="text-[8px] font-bold font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1">
                          <Check className="w-3 h-3" />
                          ALIGNED
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold font-mono tracking-widest text-amber-400 uppercase flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 px-2 py-1 animate-pulse">
                          LOCAL EDIT
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Integration explanation help widget */}
          <div className="mt-8 pt-6 border-t border-white/5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] font-mono text-white/30 tracking-wider">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ENGINES ACTIVE: FIREBASE AUTH & GOOGLE SHEETS API V4</span>
            </div>
            <span>USER SECURITY IS CACHED SECURELY IN-MEMORY ONLY</span>
          </div>

        </div>
      )}
    </div>
  );
};
