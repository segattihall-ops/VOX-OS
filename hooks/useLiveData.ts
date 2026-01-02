
import { useState, useEffect, useCallback } from 'react';
import { 
  MOCK_LEADS, MOCK_ACCOUNTS, MOCK_OPPORTUNITIES, 
  MOCK_DELIVERIES, MOCK_CONTACTS, MOCK_ACTIVITIES, 
  MOCK_TICKETS, MOCK_SUBSCRIPTIONS 
} from '../constants';

const DB_KEY = 'voxmation_db';

// Initialize DB if empty
const initDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    const initialData = {
      leads: MOCK_LEADS,
      accounts: MOCK_ACCOUNTS,
      opportunities: MOCK_OPPORTUNITIES,
      deliveries: MOCK_DELIVERIES,
      contacts: MOCK_CONTACTS,
      activities: MOCK_ACTIVITIES,
      tickets: MOCK_TICKETS,
      subscriptions: MOCK_SUBSCRIPTIONS,
      milestones: [],
      playbooks: [],
      playbookInstances: [],
      playbookTasks: [],
      reports: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  }
};

initDB();

export const useLiveCollection = <T extends { id: string }>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);

  const loadData = useCallback(() => {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    setData(db[collectionName] || []);
  }, [collectionName]);

  useEffect(() => {
    loadData();
    window.addEventListener('voxmation_db_update', loadData);
    return () => window.removeEventListener('voxmation_db_update', loadData);
  }, [loadData]);

  const addDoc = async (doc: Omit<T, 'id'>) => {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    const newDoc = { ...doc, id: Math.random().toString(36).substr(2, 9) } as T;
    db[collectionName] = [...(db[collectionName] || []), newDoc];
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('voxmation_db_update'));
    return newDoc;
  };

  const updateDoc = async (id: string, updates: Partial<T>) => {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[collectionName] = (db[collectionName] || []).map((item: T) => 
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('voxmation_db_update'));
  };

  const deleteDoc = async (id: string) => {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[collectionName] = (db[collectionName] || []).filter((item: T) => item.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('voxmation_db_update'));
  };

  return { data, addDoc, updateDoc, deleteDoc };
};

export const useLiveDoc = <T extends { id: string }>(collectionName: string, id: string | undefined) => {
  const [doc, setDoc] = useState<T | null>(null);

  const loadDoc = useCallback(() => {
    if (!id) return;
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    const found = (db[collectionName] || []).find((item: T) => item.id === id);
    setDoc(found || null);
  }, [collectionName, id]);

  useEffect(() => {
    loadDoc();
    window.addEventListener('voxmation_db_update', loadDoc);
    return () => window.removeEventListener('voxmation_db_update', loadDoc);
  }, [loadDoc]);

  const updateDoc = async (updates: Partial<T>) => {
    if (!id) return;
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[collectionName] = (db[collectionName] || []).map((item: T) => 
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('voxmation_db_update'));
  };

  return { doc, updateDoc };
};
