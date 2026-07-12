import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google OAuth Provider
export const provider = new GoogleAuthProvider();
// Add required Google Drive and Google Sheets scopes
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

// Internal Memory Caches
let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Auth State Listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If logged in but no token, we can attempt to fetch it, but usually signInWithPopup caches it.
        // If not cached, we fallback to requesting sign in or letting them click connect.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign In with Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google sign-in.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Sign Out
export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Get current token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Types for Submissions & Spreadsheets
export interface LeadSubmission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Pending' | 'In Contact' | 'Proposal' | 'Active Project' | 'Completed' | 'Archived';
  notes: string;
  synced: boolean;
}

export interface GoogleSpreadsheet {
  id: string;
  name: string;
  modifiedTime: string;
}

// Local Storage Keys
const SUBMISSIONS_STORAGE_KEY = 'nexora_submissions';
const ACTIVE_SHEET_ID_KEY = 'nexora_active_sheet_id';

// Local Storage Helpers
export const getLocalSubmissions = (): LeadSubmission[] => {
  try {
    const data = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local submissions:', err);
    return [];
  }
};

export const saveLocalSubmissions = (submissions: LeadSubmission[]) => {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  } catch (err) {
    console.error('Error saving local submissions:', err);
  }
};

export const getActiveSheetId = (): string | null => {
  return localStorage.getItem(ACTIVE_SHEET_ID_KEY);
};

export const saveActiveSheetId = (id: string | null) => {
  if (id) {
    localStorage.setItem(ACTIVE_SHEET_ID_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_SHEET_ID_KEY);
  }
};

// Add a single lead submission to local list
export const addLeadSubmission = (lead: Omit<LeadSubmission, 'id' | 'timestamp' | 'status' | 'notes' | 'synced'>): LeadSubmission => {
  const submissions = getLocalSubmissions();
  const newLead: LeadSubmission = {
    ...lead,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    status: 'Pending',
    notes: '',
    synced: false
  };
  submissions.unshift(newLead); // Add new at the top
  saveLocalSubmissions(submissions);
  return newLead;
};

// --- GOOGLE SHEETS & DRIVE API OPERATIONS ---

// 1. List user's Google Spreadsheets
export const listGoogleSpreadsheets = async (token: string): Promise<GoogleSpreadsheet[]> => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\'&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing spreadsheets:', error);
    throw error;
  }
};

// 2. Create a clean Google Spreadsheet with pre-formatted Nexora columns
export const createNexoraSpreadsheet = async (token: string, name: string = 'Nexora Leads & Commissions'): Promise<string> => {
  try {
    // A. Create Spreadsheet
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: name
        },
        sheets: [
          {
            properties: {
              title: 'Submissions',
              gridProperties: {
                rowCount: 1000,
                columnCount: 8
              }
            }
          }
        ]
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Google Sheets API create error: ${createResponse.statusText}`);
    }

    const sheetData = await createResponse.json();
    const spreadsheetId = sheetData.spreadsheetId;

    if (!spreadsheetId) {
      throw new Error('Spreadsheet creation failed to return an ID.');
    }

    // B. Initialize the headers and basic formatting
    const headersResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A1:G1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: 'Submissions!A1:G1',
          majorDimension: 'ROWS',
          values: [
            ['Timestamp', 'Client Name', 'Email Address', 'Subject', 'Project Brief / Message', 'Workflow Status', 'Admin Notes / Remarks']
          ]
        })
      }
    );

    if (!headersResponse.ok) {
      throw new Error(`Google Sheets API header initialization failed: ${headersResponse.statusText}`);
    }

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating Nexora spreadsheet:', error);
    throw error;
  }
};

// 3. Append submissions to Google Sheet
export const appendSubmissionsToSheet = async (
  token: string,
  spreadsheetId: string,
  submissions: LeadSubmission[]
): Promise<boolean> => {
  if (submissions.length === 0) return true;

  try {
    const values = submissions.map(lead => [
      new Date(lead.timestamp).toLocaleString(),
      lead.name,
      lead.email,
      lead.subject,
      lead.message,
      lead.status,
      lead.notes || ''
    ]);

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A:G:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: 'Submissions!A:G',
          majorDimension: 'ROWS',
          values: values
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API append error: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error appending submissions to Google Sheet:', error);
    throw error;
  }
};

// 4. Overwrite/Sync Google Sheet (full state sync)
export const overwriteSheetWithSubmissions = async (
  token: string,
  spreadsheetId: string,
  submissions: LeadSubmission[]
): Promise<boolean> => {
  try {
    // First, clear the entire sheet data (excluding headers)
    const clearResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A2:G1000:clear`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!clearResponse.ok) {
      throw new Error(`Google Sheets API clear error: ${clearResponse.statusText}`);
    }

    if (submissions.length === 0) return true;

    // Put new values
    const values = submissions.map(lead => [
      new Date(lead.timestamp).toLocaleString(),
      lead.name,
      lead.email,
      lead.subject,
      lead.message,
      lead.status,
      lead.notes || ''
    ]);

    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A2:G${submissions.length + 1}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: `Submissions!A2:G${submissions.length + 1}`,
          majorDimension: 'ROWS',
          values: values
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Google Sheets API update error: ${updateResponse.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error overwriting spreadsheet:', error);
    throw error;
  }
};

// 5. Read/Import submissions from Google Sheet
export const readSubmissionsFromSheet = async (
  token: string,
  spreadsheetId: string
): Promise<LeadSubmission[]> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A2:G`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API read error: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    return rows.map((row: any[], index: number) => {
      return {
        id: `gsheet-${index}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: row[0] ? new Date(row[0]).toISOString() : new Date().toISOString(),
        name: row[1] || 'Unknown Client',
        email: row[2] || 'unknown@example.com',
        subject: row[3] || 'General Inquiry',
        message: row[4] || '',
        status: (row[5] || 'Pending') as LeadSubmission['status'],
        notes: row[6] || '',
        synced: true
      };
    });
  } catch (error) {
    console.error('Error reading from Google Sheet:', error);
    throw error;
  }
};
