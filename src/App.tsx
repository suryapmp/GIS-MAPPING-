import React, { useEffect } from 'react';
import { useHydroStore } from './stores/useHydroStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AiAssistantModal } from './components/modals/AiAssistantModal';

import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { StudyAreasPage } from './pages/StudyAreasPage';
import { GisMapPage } from './pages/GisMapPage';
import { LayerManagerPage } from './pages/LayerManagerPage';
import { DataImportPage } from './pages/DataImportPage';
import { FieldSurveyPage } from './pages/FieldSurveyPage';
import { SoilModulePage } from './pages/SoilModulePage';
import { SoilLabDataPage } from './pages/SoilLabDataPage';
import { WellsModulePage } from './pages/WellsModulePage';
import { GeologyModulePage } from './pages/GeologyModulePage';
import { HydrogeologyModulePage } from './pages/HydrogeologyModulePage';
import { ErtModulePage } from './pages/ErtModulePage';
import { ReferencesPage } from './pages/ReferencesPage';
import { AhpMcdaPage } from './pages/AhpMcdaPage';
import { MachineLearningPage } from './pages/MachineLearningPage';
import { GwpzPage } from './pages/GwpzPage';
import { ValidationPage } from './pages/ValidationPage';
import { MarPage } from './pages/MarPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  const { activeModuleTab } = useHydroStore();

  const renderActiveModule = () => {
    switch (activeModuleTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'studyAreas':
        return <StudyAreasPage />;
      case 'map':
        return <GisMapPage />;
      case 'layers':
        return <LayerManagerPage />;
      case 'dataImport':
        return <DataImportPage />;
      case 'fieldSurvey':
        return <FieldSurveyPage />;
      case 'soil':
        return <SoilModulePage />;
      case 'soilLab':
        return <SoilLabDataPage />;
      case 'wells':
        return <WellsModulePage />;
      case 'geology':
        return <GeologyModulePage />;
      case 'hydrogeology':
        return <HydrogeologyModulePage />;
      case 'ert':
        return <ErtModulePage />;
      case 'references':
        return <ReferencesPage />;
      case 'ahp':
        return <AhpMcdaPage />;
      case 'ml':
        return <MachineLearningPage />;
      case 'gwpz':
        return <GwpzPage />;
      case 'validation':
        return <ValidationPage />;
      case 'mar':
        return <MarPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {renderActiveModule()}
        </main>
      </div>
      <AiAssistantModal />
    </div>
  );
}
