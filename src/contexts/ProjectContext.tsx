
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Project } from '../../types';
import { getClients } from '../../services/strategyService';
import { useAuth } from './AuthProvider';
import * as dbService from '../services/dbService';

interface ProjectContextType {
  clients: Client[];
  selectedClient: Client | null;
  selectedProject: Project | null;
  isLoading: boolean;
  selectClient: (clientId: string) => void;
  selectProject: (projectId: string) => void;
  refreshData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let loadedClients: Client[] = [];
      if (user && user.uid !== 'demo-user-123') {
         loadedClients = await dbService.getClients(user.uid);
      } else {
         loadedClients = getClients();
      }
      setClients(loadedClients);
      
      // Optional: Auto-select first client/project if nothing selected
      if (!selectedClient && loadedClients.length > 0) {
          // Don't auto-select to force user choice, or uncomment below
          // setSelectedClient(loadedClients[0]);
      }
    } catch (error) {
      console.error("Failed to load context data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const selectClient = (clientId: string) => {
    if (clientId === '') {
        setSelectedClient(null);
        setSelectedProject(null);
        return;
    }
    const client = clients.find(c => c.id === clientId) || null;
    setSelectedClient(client);
    
    // Reset project when client changes, or auto-select if only one
    if (client && client.projects && client.projects.length === 1) {
        setSelectedProject(client.projects[0]);
    } else {
        setSelectedProject(null);
    }
  };

  const selectProject = (projectId: string) => {
    if (projectId === '') {
        setSelectedProject(null);
        return;
    }
    // Search in current client first, then global
    let project = selectedClient?.projects?.find(p => p.id === projectId);
    
    // Safety fallback
    if (!project) {
        for (const c of clients) {
            project = c.projects?.find(p => p.id === projectId);
            if (project) break;
        }
    }
    
    setSelectedProject(project || null);
  };

  return (
    <ProjectContext.Provider value={{ 
        clients, 
        selectedClient, 
        selectedProject, 
        selectClient, 
        selectProject, 
        isLoading,
        refreshData: loadData
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
