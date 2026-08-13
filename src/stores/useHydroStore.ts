import { create } from 'zustand';
import {
  Project,
  StudyArea,
  Well,
  WellMeasurement,
  SoilSample,
  SoilLabResult,
  GeologicalObservation,
  HydrogeologicalObservation,
  ErtSurvey,
  ErtDataPoint,
  ScientificReference,
  AhpAnalysis,
  MlModelRun,
  GwpzResult,
  ValidationRecord,
  MarSite,
  ResearchNote,
  GisLayer,
  AuditLog,
  UserProfile,
  FieldObservation,
  UserRole
} from '../types/hydro';
import {
  INITIAL_PROJECTS,
  INITIAL_STUDY_AREAS,
  INITIAL_WELLS,
  INITIAL_WELL_MEASUREMENTS,
  INITIAL_SOIL_SAMPLES,
  INITIAL_SOIL_LAB_RESULTS,
  INITIAL_GEOLOGY_OBSERVATIONS,
  INITIAL_HYDRO_OBSERVATIONS,
  INITIAL_ERT_SURVEYS,
  INITIAL_ERT_DATA,
  INITIAL_REFERENCES,
  INITIAL_AHP_ANALYSES,
  INITIAL_ML_RUNS,
  INITIAL_GWPZ_RESULTS,
  INITIAL_VALIDATION_RECORDS,
  INITIAL_MAR_SITES,
  INITIAL_RESEARCH_NOTES,
  INITIAL_GIS_LAYERS,
  INITIAL_AUDIT_LOGS
} from '../data/sampleSeedData';

interface HydroState {
  // Current session & active filters
  currentUser: UserProfile;
  activeProjectId: string;
  activeStudyAreaId: string;
  activeModuleTab: string;
  
  // Map configuration
  basemapTile: 'osm' | 'satellite' | 'terrain';
  mapCenter: [number, number];
  mapZoom: number;
  defaultMapCenter: [number, number];
  defaultMapZoom: number;
  userLocation: [number, number] | null;
  userLocationAccuracy: number | null;
  drawingTool: 'polygon' | 'line' | 'marker' | 'circle' | null;

  // Hydrogeological datasets
  projects: Project[];
  studyAreas: StudyArea[];
  wells: Well[];
  wellMeasurements: WellMeasurement[];
  soilSamples: SoilSample[];
  soilLabResults: SoilLabResult[];
  geologicalObservations: GeologicalObservation[];
  hydrogeologicalObservations: HydrogeologicalObservation[];
  ertSurveys: ErtSurvey[];
  ertDataPoints: ErtDataPoint[];
  scientificReferences: ScientificReference[];
  ahpAnalyses: AhpAnalysis[];
  mlModelRuns: MlModelRun[];
  gwpzResults: GwpzResult[];
  validationRecords: ValidationRecord[];
  marSites: MarSite[];
  researchNotes: ResearchNote[];
  gisLayers: GisLayer[];
  fieldObservations: FieldObservation[];
  auditLogs: AuditLog[];

  // Actions
  setUserRole: (role: UserRole) => void;
  setActiveProject: (projectId: string) => void;
  setActiveStudyArea: (studyAreaId: string) => void;
  setActiveModuleTab: (tab: string) => void;
  setBasemapTile: (tile: 'osm' | 'satellite' | 'terrain') => void;
  setMapViewState: (center: [number, number], zoom: number) => void;
  setDefaultMapView: (center: [number, number], zoom: number) => void;
  resetToDefaultMapView: () => void;
  setUserLocation: (location: [number, number] | null, accuracy?: number | null) => void;
  setDrawingTool: (tool: 'polygon' | 'line' | 'marker' | 'circle' | null) => void;

  // Add / Modify entities
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addStudyArea: (studyArea: Omit<StudyArea, 'id' | 'createdAt'>) => void;
  addWell: (well: Omit<Well, 'id' | 'createdAt'>) => void;
  addWellMeasurement: (measurement: Omit<WellMeasurement, 'id'>) => void;
  addSoilSample: (sample: Omit<SoilSample, 'id'>) => void;
  addSoilLabResult: (result: Omit<SoilLabResult, 'id'>) => void;
  addGeologicalObservation: (obs: Omit<GeologicalObservation, 'id' | 'timestamp'>) => void;
  addHydroObservation: (obs: Omit<HydrogeologicalObservation, 'id' | 'timestamp'>) => void;
  addErtSurvey: (survey: Omit<ErtSurvey, 'id'>) => void;
  addScientificReference: (ref: Omit<ScientificReference, 'id'>) => void;
  addAhpAnalysis: (ahp: Omit<AhpAnalysis, 'id' | 'createdAt'>) => void;
  addMlModelRun: (ml: MlModelRun) => void;
  addGwpzResult: (gwpz: Omit<GwpzResult, 'id' | 'createdAt'>) => void;
  addMarSite: (site: Omit<MarSite, 'id' | 'createdAt'>) => void;
  addResearchNote: (note: Omit<ResearchNote, 'id'>) => void;
  addGisLayer: (layer: Omit<GisLayer, 'id' | 'createdAt'>) => void;
  addFieldObservation: (obs: Omit<FieldObservation, 'id' | 'timestamp'>) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerOverlay: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  deleteGisLayer: (layerId: string) => void;
  approveMarSite: (siteId: string) => void;
  logSystemAction: (action: string, targetCollection: string, details: string) => void;
}

export const useHydroStore = create<HydroState>((set, get) => ({
  currentUser: {
    uid: 'usr-admin-01',
    email: 'sp40016@gmail.com',
    displayName: 'Dr. Aris Thorne',
    role: 'ADMIN',
    organization: 'International Hydrogeological Research Institute',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  activeProjectId: 'proj-001',
  activeStudyAreaId: 'sa-001',
  activeModuleTab: 'dashboard',

  basemapTile: 'terrain',
  mapCenter: [12.85, 79.035],
  mapZoom: 11,
  defaultMapCenter: [12.85, 79.035],
  defaultMapZoom: 11,
  userLocation: null,
  userLocationAccuracy: null,
  drawingTool: null,

  projects: INITIAL_PROJECTS,
  studyAreas: INITIAL_STUDY_AREAS,
  wells: INITIAL_WELLS,
  wellMeasurements: INITIAL_WELL_MEASUREMENTS,
  soilSamples: INITIAL_SOIL_SAMPLES,
  soilLabResults: INITIAL_SOIL_LAB_RESULTS,
  geologicalObservations: INITIAL_GEOLOGY_OBSERVATIONS,
  hydrogeologicalObservations: INITIAL_HYDRO_OBSERVATIONS,
  ertSurveys: INITIAL_ERT_SURVEYS,
  ertDataPoints: INITIAL_ERT_DATA,
  scientificReferences: INITIAL_REFERENCES,
  ahpAnalyses: INITIAL_AHP_ANALYSES,
  mlModelRuns: INITIAL_ML_RUNS,
  gwpzResults: INITIAL_GWPZ_RESULTS,
  validationRecords: INITIAL_VALIDATION_RECORDS,
  marSites: INITIAL_MAR_SITES,
  researchNotes: INITIAL_RESEARCH_NOTES,
  gisLayers: INITIAL_GIS_LAYERS,
  fieldObservations: [],
  auditLogs: INITIAL_AUDIT_LOGS,

  setUserRole: (role) => set((state) => ({
    currentUser: { ...state.currentUser, role }
  })),

  setActiveProject: (projectId) => {
    const studyArea = get().studyAreas.find(s => s.projectId === projectId);
    set({
      activeProjectId: projectId,
      activeStudyAreaId: studyArea ? studyArea.id : ''
    });
  },

  setActiveStudyArea: (studyAreaId) => set({ activeStudyAreaId: studyAreaId }),
  setActiveModuleTab: (tab) => set({ activeModuleTab: tab }),
  setBasemapTile: (tile) => set({ basemapTile: tile }),
  setMapViewState: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
  setDefaultMapView: (center, zoom) => set({ defaultMapCenter: center, defaultMapZoom: zoom }),
  resetToDefaultMapView: () => set((state) => ({ mapCenter: state.defaultMapCenter, mapZoom: state.defaultMapZoom })),
  setUserLocation: (location, accuracy = null) => set({ userLocation: location, userLocationAccuracy: accuracy }),
  setDrawingTool: (tool) => set({ drawingTool: tool }),

  addProject: (p) => {
    const newProj: Project = {
      ...p,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state) => ({
      projects: [newProj, ...state.projects],
      activeProjectId: newProj.id,
      auditLogs: [{
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userEmail: state.currentUser.email,
        action: 'CREATE_PROJECT',
        targetCollection: 'projects',
        targetId: newProj.id,
        timestamp: new Date().toISOString(),
        details: `Created project: ${newProj.name}`
      }, ...state.auditLogs]
    }));
  },

  addStudyArea: (sa) => {
    const newSA: StudyArea = {
      ...sa,
      id: `sa-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      studyAreas: [newSA, ...state.studyAreas],
      activeStudyAreaId: newSA.id
    }));
  },

  addWell: (wellData) => {
    set((state) => {
      const existingIdx = state.wells.findIndex(w => w.wellId === wellData.wellId);
      if (existingIdx >= 0) {
        const updatedWells = [...state.wells];
        updatedWells[existingIdx] = {
          ...updatedWells[existingIdx],
          ...wellData
        };
        return { wells: updatedWells };
      }

      const newWell: Well = {
        ...wellData,
        id: `well-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString()
      };
      // Also update GIS layer features
      const wellsLayer = state.gisLayers.find(l => l.id === 'layer-wells');
      let updatedLayers = state.gisLayers;
      if (wellsLayer) {
        const newFeature = {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [newWell.lng, newWell.lat] },
          properties: { wellId: newWell.wellId, type: newWell.wellType, depth: newWell.depthM, yield: newWell.yieldLps, status: newWell.status }
        };
        updatedLayers = state.gisLayers.map(l => l.id === 'layer-wells' ? {
          ...l,
          featureCount: l.featureCount + 1,
          data: {
            ...l.data,
            features: [...l.data.features, newFeature]
          }
        } : l);
      }
      return {
        wells: [newWell, ...state.wells],
        gisLayers: updatedLayers
      };
    });
  },

  addWellMeasurement: (m) => set((state) => ({
    wellMeasurements: [{ ...m, id: `wm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }, ...state.wellMeasurements]
  })),

  addSoilSample: (s) => set((state) => ({
    soilSamples: [{ ...s, id: `soil-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }, ...state.soilSamples]
  })),

  addSoilLabResult: (r) => set((state) => ({
    soilLabResults: [{ ...r, id: `slr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }, ...state.soilLabResults]
  })),

  addGeologicalObservation: (obs) => set((state) => ({
    geologicalObservations: [{ ...obs, id: `geo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, timestamp: new Date().toISOString() }, ...state.geologicalObservations]
  })),

  addHydroObservation: (obs) => set((state) => ({
    hydrogeologicalObservations: [{ ...obs, id: `hy-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, timestamp: new Date().toISOString() }, ...state.hydrogeologicalObservations]
  })),

  addErtSurvey: (survey) => set((state) => ({
    ertSurveys: [{ ...survey, id: `ert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }, ...state.ertSurveys]
  })),

  addScientificReference: (ref) => set((state) => ({
    scientificReferences: [{ ...ref, id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }, ...state.scientificReferences]
  })),

  addAhpAnalysis: (ahp) => set((state) => ({
    ahpAnalyses: [{ ...ahp, id: `ahp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, createdAt: new Date().toISOString() }, ...state.ahpAnalyses]
  })),

  addMlModelRun: (ml) => set((state) => ({
    mlModelRuns: [ml, ...state.mlModelRuns]
  })),

  addGwpzResult: (gwpz) => set((state) => ({
    gwpzResults: [{ ...gwpz, id: `gwpz-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, createdAt: new Date().toISOString() }, ...state.gwpzResults]
  })),

  addMarSite: (site) => set((state) => ({
    marSites: [{ ...site, id: `mar-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, createdAt: new Date().toISOString() }, ...state.marSites]
  })),

  addResearchNote: (note) => set((state) => ({
    researchNotes: [{ ...note, id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` }, ...state.researchNotes]
  })),

  addGisLayer: (layer) => set((state) => ({
    gisLayers: [{ ...layer, id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, createdAt: new Date().toISOString() }, ...state.gisLayers]
  })),

  addFieldObservation: (obs) => set((state) => ({
    fieldObservations: [{ ...obs, id: `fo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, timestamp: new Date().toISOString() }, ...state.fieldObservations]
  })),

  toggleLayerVisibility: (layerId) => set((state) => ({
    gisLayers: state.gisLayers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)
  })),

  toggleLayerOverlay: (layerId) => set((state) => ({
    gisLayers: state.gisLayers.map(l => l.id === layerId ? { ...l, isOverlay: !l.isOverlay } : l)
  })),

  setLayerOpacity: (layerId, opacity) => set((state) => ({
    gisLayers: state.gisLayers.map(l => l.id === layerId ? { ...l, opacity } : l)
  })),

  deleteGisLayer: (layerId) => set((state) => ({
    gisLayers: state.gisLayers.filter(l => l.id !== layerId)
  })),

  approveMarSite: (siteId) => set((state) => ({
    marSites: state.marSites.map(s => s.id === siteId ? { ...s, researcherApproved: true } : s)
  })),

  logSystemAction: (action, targetCollection, details) => set((state) => ({
    auditLogs: [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userEmail: state.currentUser.email,
        action,
        targetCollection,
        targetId: 'sys-exec',
        timestamp: new Date().toISOString(),
        details
      },
      ...state.auditLogs
    ]
  }))
}));
