// Mocking Firebase services to resolve missing module errors since the 'firebase' package is not available or compatible.

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}

class MockAuth {
  currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {}

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  addListener(cb: (user: User | null) => void) {
    this.listeners.push(cb);
    cb(this.currentUser); // Trigger immediate state
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }
}

export const auth = new MockAuth();
export const db = {}; // Mock Firestore

export const signInAnonymously = async (authInstance: any) => {
  console.log('Mock signInAnonymously called');
  const user: User = {
    uid: 'anon-' + Math.random().toString(36).substr(2, 9),
    email: null,
    displayName: 'Guest',
    isAnonymous: true
  };
  authInstance.currentUser = user;
  authInstance.notify();
  return { user };
};

export const signInWithCustomToken = async (authInstance: any, token: string) => {
  console.log('Mock signInWithCustomToken called');
  const user: User = {
    uid: 'user-' + Math.random().toString(36).substr(2, 9),
    email: 'user@example.com',
    displayName: 'Demo User',
    isAnonymous: false
  };
  authInstance.currentUser = user;
  authInstance.notify();
  return { user };
};

export const signOut = async (authInstance: any) => {
  console.log('Mock signOut called');
  authInstance.currentUser = null;
  authInstance.notify();
};

export const onAuthStateChanged = (authInstance: any, callback: (user: User | null) => void) => {
  return authInstance.addListener(callback);
};

// Mock app initialization if referenced elsewhere (though not in the current App.tsx usage)
export const initializeApp = (config: any) => ({});
export const getAuth = (app: any) => auth;
export const getFirestore = (app: any) => db;