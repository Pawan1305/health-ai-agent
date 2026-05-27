import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const getSavedContext = () => {
  try {
    return localStorage.getItem('medimind_context') || '';
  } catch {
    return '';
  }
};

const initialState = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  sidebarOpen: true,
  contextModalOpen: false,
  medicalContext: getSavedContext(),
};

function reducer(state, action) {
  switch (action.type) {

    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };

    case 'ADD_CONVERSATION': {
      const exists = state.conversations.find(c => c._id === action.payload._id);
      if (exists) {
        return {
          ...state,
          conversations: state.conversations.map(c =>
            c._id === action.payload._id ? { ...c, ...action.payload } : c
          ),
        };
      }
      return { ...state, conversations: [action.payload, ...state.conversations] };
    }

    case 'UPDATE_CONVERSATION_TITLE':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c._id === action.payload.id ? { ...c, title: action.payload.title } : c
        ),
      };

    case 'SET_CURRENT_CONVERSATION':
      return {
        ...state,
        currentConversationId: action.payload.id,
        messages: action.payload.messages || [],
      };

    // Sets only the ID without clearing in-progress messages (used during streaming)
    case 'SET_CONVERSATION_ID':
      return { ...state, currentConversationId: action.payload };

    case 'NEW_CONVERSATION':
      return {
        ...state,
        currentConversationId: null,
        messages: [],
      };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'APPEND_TO_LAST_MESSAGE': {
      if (!state.messages.length) return state;
      const updated = [...state.messages];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        content: last.content + action.payload,
      };
      return { ...state, messages: updated };
    }

    case 'FINALIZE_LAST_MESSAGE': {
      if (!state.messages.length) return state;
      const updated = [...state.messages];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        isStreaming: false,
      };
      return { ...state, messages: updated };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CONTEXT': {
      try { localStorage.setItem('medimind_context', action.payload); } catch {}
      return { ...state, medicalContext: action.payload };
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };

    case 'TOGGLE_CONTEXT_MODAL':
      return { ...state, contextModalOpen: !state.contextModalOpen };

    case 'SET_CONTEXT_MODAL':
      return { ...state, contextModalOpen: action.payload };

    case 'DELETE_CONVERSATION': {
      const filtered = state.conversations.filter(c => c._id !== action.payload);
      const cleared = state.currentConversationId === action.payload
        ? { currentConversationId: null, messages: [] }
        : {};
      return { ...state, conversations: filtered, ...cleared };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
