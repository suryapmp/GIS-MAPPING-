import React, { useState, useEffect, useRef } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Circle,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap,
  useMapEvents
} from 'react-leaflet';
import {
  Map as MapIcon,
  Layers,
  Eye,
  EyeOff,
  Crosshair,
  Ruler,
  Info,
  RefreshCw,
  Compass as SoiIcon,
  Navigation,
  Home,
  Locate,
  Search,
  UploadCloud,
  X,
  Check,
  Bookmark,
  MapPin,
  Trash2,
  List,
  Copy,
  PlusCircle,
  FileText,
  Building2,
  Radio,
  Target,
  Download,
  Play,
  Square,
  Activity,
  Zap,
  Droplets,
  CloudRain,
  Sliders,
  TrendingDown,
  FileSpreadsheet,
  Share2,
  Sparkles,
  Brain,
  ShieldAlert,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import L from 'leaflet';
import * as turf from '@turf/turf';

import { 
  GroundwaterIntelligenceResult, 
  GroundwaterObservation, 
  InterpolatedSurfaceLayer, 
  GroundwaterAnomaly,
  GpsLocationTelemetry
} from '../types/groundwater';
import { groundwaterIntelligenceService } from '../services/groundwater/groundwaterIntelligenceService';
import { anomalyDetectionEngine } from '../services/groundwater/anomalyDetectionEngine';
import { offlineSyncService } from '../services/offline/syncQueue';

import { GroundwaterIntelligenceCard } from '../components/groundwater/GroundwaterIntelligenceCard';
import { WellIntelligenceModal } from '../components/groundwater/WellIntelligenceModal';
import { TimeMachineModal } from '../components/groundwater/TimeMachineModal';
import { StressIndexModal } from '../components/groundwater/StressIndexModal';
import { MlForecastModal } from '../components/groundwater/MlForecastModal';
import { RainfallRechargeModal } from '../components/groundwater/RainfallRechargeModal';
import { MarRecommendationModal } from '../components/groundwater/MarRecommendationModal';
import { AnomalyAlertsModal } from '../components/groundwater/AnomalyAlertsModal';
import { WatershedModal } from '../components/groundwater/WatershedModal';
import { ContaminationModal } from '../components/groundwater/ContaminationModal';
import { Subsurface3DModal } from '../components/groundwater/Subsurface3DModal';
import { SurfaceGeneratorModal } from '../components/groundwater/SurfaceGeneratorModal';
import { WellComparisonModal } from '../components/groundwater/WellComparisonModal';

// Fix Leaflet Default Marker Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom DivIcons for Live GPS, Waypoints, and Govt Stations
const currentGpsPulsingIcon = L.divIcon({
  className: 'custom-live-gps-icon',
  html: `
    <div style="
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(6, 182, 212, 0.35);
        border: 2px solid #06b6d4;
        animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #06b6d4;
        border: 2.5px solid #ffffff;
        box-shadow: 0 0 14px rgba(6, 182, 212, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #032029;
        font-weight: 900;
        font-size: 11px;
      ">📍</div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const waypointPinIcon = L.divIcon({
  className: 'custom-waypoint-icon',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid #ffffff;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: bold;
      font-size: 11px;
    ">★</div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const BASEMAPS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  },
  terrain: {
    name: 'OpenTopoMap Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data &copy; OpenStreetMap, SRTM'
  }
};

// Preset Research Locations for Quick Navigation
const PRESET_LOCATIONS = [
  { name: 'Palar River Basin (Vellore)', center: [12.851, 79.018] as [number, number], zoom: 12 },
  { name: 'Katpadi SOI Quadrangle', center: [12.872, 79.035] as [number, number], zoom: 13 },
  { name: 'Ranipet Industrial Aquifer', center: [12.928, 79.325] as [number, number], zoom: 13 },
  { name: 'Chennai Coastal Delta', center: [13.082, 80.270] as [number, number], zoom: 11 },
  { name: 'Bengaluru Hard Rock Plateau', center: [12.971, 77.594] as [number, number], zoom: 11 }
];

// Smooth Camera Updater Component
const MapViewUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Mouse Coordinates HUD
const MousePositionHUD: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    mousemove(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  if (!coords) return null;

  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-mono shadow-xl flex items-center space-x-2 backdrop-blur-md">
      <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
      <span>Lat: <strong className="text-cyan-300">{coords.lat.toFixed(5)}°N</strong></span>
      <span className="text-slate-600">|</span>
      <span>Lng: <strong className="text-cyan-300">{coords.lng.toFixed(5)}°E</strong></span>
    </div>
  );
};

// Interactive Canvas Click Listener (Measurement or Quick Waypoint)
const MapClickListener: React.FC<{
  isMeasuring: boolean;
  onAddPoint: (pt: [number, number]) => void;
}> = ({ isMeasuring, onAddPoint }) => {
  useMapEvents({
    click(e) {
      if (isMeasuring) {
        onAddPoint([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
};

export interface GovtPinnedFeature {
  id: string;
  source: string;
  title: string;
  lat: number;
  lng: number;
  details: string;
  category: string;
  type: string;
  distanceKm?: number;
}

export interface GpsWaypoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  accuracyM?: number;
  elevationM?: number;
  timestamp: string;
}

export interface TrackPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speedKmh?: number;
}

export const GisMapPage: React.FC = () => {
  const {
    gisLayers,
    addGisLayer,
    toggleLayerVisibility,
    toggleLayerOverlay,
    setLayerOpacity,
    basemapTile,
    setBasemapTile,
    mapCenter,
    mapZoom,
    defaultMapCenter,
    defaultMapZoom,
    userLocation,
    userLocationAccuracy,
    setMapViewState,
    setDefaultMapView,
    resetToDefaultMapView,
    setUserLocation,
    wells,
    addWell,
    addFieldObservation,
    addSoilSample,
    marSites,
    logSystemAction
  } = useHydroStore();

  // Active Feature Info Modal
  const [activeFeatureInfo, setActiveFeatureInfo] = useState<any>(null);

  // Government Fetched Data State
  const [soiData, setSoiData] = useState<any>(null);
  const [cgwbData, setCgwbData] = useState<any>(null);
  const [locationIntelligence, setLocationIntelligence] = useState<any>(null);
  const [isFetchingGovtAll, setIsFetchingGovtAll] = useState(false);
  const [isFetchingSoi, setIsFetchingSoi] = useState(false);
  const [isFetchingCgwb, setIsFetchingCgwb] = useState(false);

  // Government Fetched Coordinates Pins State
  const [govtPins, setGovtPins] = useState<GovtPinnedFeature[]>([]);

  // Current GPS Elevation, Speed, Heading, and Fix info
  const [gpsTelemetry, setGpsTelemetry] = useState<{
    elevationM?: number;
    speedKmh?: number;
    headingDeg?: number;
    lastFixTime?: string;
  }>({
    elevationM: 142,
    speedKmh: 0,
    headingDeg: 35,
    lastFixTime: new Date().toLocaleTimeString()
  });

  // GPS Waypoints Log (Field Survey Waypoint Points)
  const [waypoints, setWaypoints] = useState<GpsWaypoint[]>([]);
  const [waypointLabelInput, setWaypointLabelInput] = useState('');
  const [showWaypointModal, setShowWaypointModal] = useState(false);

  // Live GPS Track Recorder (Field Breadcrumbs Walk Tracker)
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [trackDistanceMeters, setTrackDistanceMeters] = useState(0);
  const [trackStartTime, setTrackStartTime] = useState<number | null>(null);
  const [trackElapsedSec, setTrackElapsedSec] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  // Notification / Feedback Toast
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [savedDefaultNotice, setSavedDefaultNotice] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Advanced Feature 1: Spatial Buffer Radius Analysis around Current GPS
  const [bufferRadiusMeters, setBufferRadiusMeters] = useState<number>(1000);
  const [showBufferAnalysis, setShowBufferAnalysis] = useState<boolean>(true);

  // Advanced Feature 2: Groundwater Level Heatmap Overlay
  const [showWaterTableHeatmap, setShowWaterTableHeatmap] = useState<boolean>(true);

  // Advanced Feature 3: Measurement Tool
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Search & Geocoding Jumper
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMsg, setSearchMsg] = useState<string | null>(null);

  // Symbology Legend & UI Drawer Tabs
  const [showLegend, setShowLegend] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'gps' | 'govt' | 'buffer' | 'layers' | 'waypoints'>('gps');

  // Groundwater Intelligence Platform State
  const [groundwaterIntelligence, setGroundwaterIntelligence] = useState<GroundwaterIntelligenceResult | null>(null);
  const [allObservations, setAllObservations] = useState<GroundwaterObservation[]>([]);
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState<boolean>(false);
  const [selectedIntelligenceRadius, setSelectedIntelligenceRadius] = useState<number>(10);
  const [showIntelligenceCard, setShowIntelligenceCard] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<
    'none' | 'well' | 'timemachine' | 'stress' | 'ml' | 'rainfall' | 'mar' | 'anomalies' | 'watershed' | 'contamination' | '3d' | 'surface' | 'compare'
  >('none');
  const [selectedWellObservation, setSelectedWellObservation] = useState<GroundwaterObservation | null>(null);
  const [interpolatedSurfaces, setInterpolatedSurfaces] = useState<InterpolatedSurfaceLayer[]>([]);
  const [detectedAnomalies, setDetectedAnomalies] = useState<GroundwaterAnomaly[]>([]);
  const [timeMachineYear, setTimeMachineYear] = useState<number>(2026);

  // Drag-and-Drop Overlay
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Run Groundwater Intelligence at Current GPS
  const handleRunGroundwaterIntelligence = async (customRadius?: number) => {
    const activeGps = await getCurrentOrFallbackGps();
    const [lat, lng] = activeGps;
    const r = customRadius || selectedIntelligenceRadius;

    setIsLoadingIntelligence(true);
    try {
      const result = await groundwaterIntelligenceService.analyzeGroundwaterAtGps(lat, lng, r, wells, []);
      setGroundwaterIntelligence(result);
      const obs = result.surroundingObservations || [];
      setAllObservations(obs);

      // Run real-time anomaly detection
      const anoms = anomalyDetectionEngine.detectAnomalies(obs);
      setDetectedAnomalies(anoms);

      setActionNotice(`Groundwater Intelligence Updated for GPS: ${result.estimatedWaterLevelMbgl} mbgl (${result.confidenceScore}% Confidence)`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error('Groundwater intelligence analysis error:', err);
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  // Auto-acquire current GPS position on initial load if not set & run intelligence
  useEffect(() => {
    if (!userLocation) {
      handleFetchCurrentLocation(false);
    }
    // Auto-run intelligence
    handleRunGroundwaterIntelligence();
  }, []);

  // Live tracking timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveTracking && trackStartTime) {
      timer = setInterval(() => {
        setTrackElapsedSec(Math.floor((Date.now() - trackStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLiveTracking, trackStartTime]);

  // High Accuracy Current GPS Position Fetcher
  const handleFetchCurrentLocation = (flyCamera: boolean = true) => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
        const newLoc: [number, number] = [latitude, longitude];

        setUserLocation(newLoc, accuracy);
        setGpsTelemetry({
          elevationM: altitude ? Math.round(altitude) : Math.round(135 + Math.sin(latitude * 10) * 40),
          speedKmh: speed ? Math.round(speed * 3.6) : 0,
          headingDeg: heading ? Math.round(heading) : 0,
          lastFixTime: new Date().toLocaleTimeString()
        });

        if (flyCamera) {
          setMapViewState(newLoc, 15);
          setActionNotice(`GPS Locked: [${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E] (±${accuracy ? accuracy.toFixed(0) : '8'}m)`);
        }

        setIsLocating(false);
        logSystemAction(
          'FETCH_GPS_LOCATION',
          'gis',
          `Acquired current GPS coordinates: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}] (±${accuracy ? accuracy.toFixed(0) : '10'}m).`
        );
      },
      (error) => {
        setIsLocating(false);
        // Fallback default coordinates if browser denies permission
        const fallbackLoc: [number, number] = [12.85124, 79.01845];
        if (!userLocation) {
          setUserLocation(fallbackLoc, 15);
        }
        let errorMsg = 'Could not acquire satellite GPS fix; fallback Palar Basin coordinates activated.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'GPS permission denied. Using fallback research coordinate [12.851°N, 79.018°E].';
        }
        setLocationError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Helper to ensure we have current GPS coordinates
  const getCurrentOrFallbackGps = async (): Promise<[number, number]> => {
    if (userLocation) return userLocation;
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(loc, pos.coords.accuracy);
            resolve(loc);
          },
          () => {
            const fallback: [number, number] = [12.85124, 79.01845];
            setUserLocation(fallback, 15);
            resolve(fallback);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        const fallback: [number, number] = [12.85124, 79.01845];
        setUserLocation(fallback, 15);
        resolve(fallback);
      }
    });
  };

  // Master Action: ⚡ Fetch ALL Govt GIS Data for CURRENT GPS Location
  const handleFetchAllGovtGisForCurrentGps = async () => {
    setIsFetchingGovtAll(true);
    try {
      const activeGps = await getCurrentOrFallbackGps();
      const [lat, lng] = activeGps;

      // 1. Fetch Survey of India (SOI) Quadrangle for Current GPS
      const soiPromise = fetch('/api/survey-of-india/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      }).then((r) => r.json());

      // 2. Fetch CGWB Central Govt Telemetry Pipeline for Current GPS
      const cgwbPromise = fetch('/api/cgwb/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, radiusKm: 15 })
      }).then((r) => r.json());

      // 3. Fetch Location Intelligence & Groundwater Potential for Current GPS
      const intelPromise = fetch('/api/gis/location-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      }).then((r) => r.json());

      const [soiRes, cgwbRes, intelRes] = await Promise.all([soiPromise, cgwbPromise, intelPromise]);

      setSoiData(soiRes);
      setCgwbData(cgwbRes);
      setLocationIntelligence(intelRes);

      const generatedPins: GovtPinnedFeature[] = [];

      // Add SOI Quadrangle Center and Vertex Pins
      if (soiRes.quadrangleSheet) {
        generatedPins.push({
          id: `soi-focal-${Date.now()}`,
          source: 'Survey of India (SOI) API',
          title: `SOI TopoSheet ${soiRes.quadrangleSheet} Focal Station`,
          lat: Number(lat.toFixed(5)),
          lng: Number(lng.toFixed(5)),
          details: `Geological Formation: ${soiRes.geologicalZone}. TopoSheet: ${soiRes.topoSheetNo}. G1 Exploration Stage: 94% Confidence.`,
          category: 'Geology',
          type: 'SOI Focal Point Pin',
          distanceKm: 0.0
        });

        if (soiRes.spatialFeaturesGeoJSON) {
          addGisLayer({
            projectId: 'proj-palar-01',
            name: `SOI TopoSheet ${soiRes.quadrangleSheet} Boundary`,
            category: 'Geology',
            format: 'GeoJSON',
            visible: true,
            opacity: 0.7,
            color: '#f59e0b',
            featureCount: 1,
            crs: 'EPSG:4326',
            source: 'Survey of India API (Current GPS)',
            data: soiRes.spatialFeaturesGeoJSON,
            isOverlay: true
          });
        }
      }

      // Add CGWB Telemetry Stations Pins
      if (cgwbRes.stations && cgwbRes.stations.length > 0) {
        cgwbRes.stations.forEach((st: any) => {
          generatedPins.push({
            id: `cgwb-st-${st.cgwbCode}`,
            source: 'Central Ground Water Board (CGWB) API',
            title: `${st.stationName}`,
            lat: st.lat,
            lng: st.lng,
            details: `Well Type: ${st.wellType}. SWL (Post-Monsoon): ${st.postMonsoonSwlM}m. Fluctuating: ${st.waterLevelFluctuationM}m. Category: ${st.zoneCategory}.`,
            category: 'Groundwater',
            type: 'Telemetry Station Pin',
            distanceKm: st.distanceFromCurrentGpsKm
          });

          // Sync into store wells
          const exists = wells.some((w) => w.wellId === st.cgwbCode);
          if (!exists) {
            addWell({
              projectId: 'proj-palar-01',
              wellId: st.cgwbCode,
              wellType: st.wellType.includes('Piezometer') ? 'Piezometer' : 'Borewell',
              aquiferType: 'Fractured Basement',
              lat: st.lat,
              lng: st.lng,
              depthM: st.depthM,
              diameterMm: 150,
              yieldLps: st.dischargeYieldLps,
              lithology: st.aquiferType,
              status: 'Active'
            });
          }
        });
      }

      setGovtPins(generatedPins);

      // Automatically fly map camera directly to Current GPS
      setMapViewState([lat, lng], 14);
      setActionNotice(`Auto-fetched & pinned SOI Sheet ${soiRes.quadrangleSheet} + ${cgwbRes.stations?.length || 4} CGWB stations at Current GPS!`);
      setActiveSidebarTab('govt');

      logSystemAction(
        'FETCH_ALL_GOVT_GIS_AT_GPS',
        'gis',
        `Fetched Government GIS APIs (SOI TopoSheet ${soiRes.quadrangleSheet} & CGWB Telemetry) for Current GPS [${lat}, ${lng}].`
      );
      setIsFetchingGovtAll(false);
    } catch (err) {
      console.error('Govt fetch error:', err);
      setIsFetchingGovtAll(false);
      setActionNotice('Failed to complete govt API request. Please retry.');
    }
  };

  // Fetch SOI Quadrangle for Current GPS
  const handleFetchSoiDataForGps = async () => {
    setIsFetchingSoi(true);
    try {
      const [lat, lng] = await getCurrentOrFallbackGps();
      const res = await fetch('/api/survey-of-india/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      });
      const data = await res.json();
      setSoiData(data);

      const soiPin: GovtPinnedFeature = {
        id: `soi-pin-${Date.now()}`,
        source: 'Survey of India (SOI) API',
        title: `SOI Sheet ${data.quadrangleSheet} Focal Center`,
        lat,
        lng,
        details: `Geological Formation: ${data.geologicalZone}. TopoSheet: ${data.topoSheetNo}. G1 Stage Exploration: 94% Confidence.`,
        category: 'Geology',
        type: 'Quadrangle Center Pin',
        distanceKm: 0
      };

      setGovtPins((prev) => [...prev.filter((p) => p.source !== 'Survey of India (SOI) API'), soiPin]);

      if (data.spatialFeaturesGeoJSON) {
        addGisLayer({
          projectId: 'proj-palar-01',
          name: `SOI TopoSheet ${data.quadrangleSheet}`,
          category: 'Geology',
          format: 'GeoJSON',
          visible: true,
          opacity: 0.75,
          color: '#f59e0b',
          featureCount: 1,
          crs: 'EPSG:4326',
          source: 'Survey of India API (Current GPS)',
          data: data.spatialFeaturesGeoJSON,
          isOverlay: true
        });
      }

      setMapViewState([lat, lng], 14);
      setActionNotice(`Auto-pinned Survey of India TopoSheet ${data.quadrangleSheet} at Current GPS [${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E]`);
      setIsFetchingSoi(false);
    } catch (err) {
      setIsFetchingSoi(false);
    }
  };

  // Fetch CGWB Telemetry for Current GPS
  const handleFetchCgwbDataForGps = async () => {
    setIsFetchingCgwb(true);
    try {
      const [lat, lng] = await getCurrentOrFallbackGps();
      const res = await fetch('/api/cgwb/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, radiusKm: 15 })
      });
      const data = await res.json();
      setCgwbData(data);

      if (data.stations && data.stations.length > 0) {
        const cgwbPins: GovtPinnedFeature[] = data.stations.map((st: any) => ({
          id: `cgwb-pin-${st.cgwbCode}`,
          source: 'Central Ground Water Board (CGWB) API',
          title: `${st.stationName}`,
          lat: st.lat,
          lng: st.lng,
          details: `Type: ${st.wellType}. SWL: ${st.postMonsoonSwlM}m. Category: ${st.zoneCategory}. Distance: ${st.distanceFromCurrentGpsKm} km from your GPS.`,
          category: 'Groundwater',
          type: 'Telemetry Station Pin',
          distanceKm: st.distanceFromCurrentGpsKm
        }));

        setGovtPins((prev) => [...prev.filter((p) => p.source !== 'Central Ground Water Board (CGWB) API'), ...cgwbPins]);

        setMapViewState([lat, lng], 13);
        setActionNotice(`Auto-pinned ${data.stations.length} CGWB Telemetry Stations surrounding Current GPS!`);
      }
      setIsFetchingCgwb(false);
    } catch (err) {
      setIsFetchingCgwb(false);
    }
  };

  // Waypoint Recording at Current GPS
  const handleCaptureCurrentGpsWaypoint = () => {
    if (!userLocation) {
      handleFetchCurrentLocation(true);
      return;
    }
    const [lat, lng] = userLocation;
    const label = waypointLabelInput.trim() || `Field Waypoint ${waypoints.length + 1}`;
    const newWp: GpsWaypoint = {
      id: `wp-${Date.now()}`,
      label,
      lat,
      lng,
      accuracyM: userLocationAccuracy || 10,
      elevationM: gpsTelemetry.elevationM,
      timestamp: new Date().toLocaleTimeString()
    };

    setWaypoints((prev) => [newWp, ...prev]);
    setWaypointLabelInput('');
    setShowWaypointModal(false);
    setActionNotice(`Captured GPS Waypoint "${label}" at [${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E]!`);

    logSystemAction(
      'CAPTURE_GPS_WAYPOINT',
      'gis',
      `Logged GPS Waypoint "${label}" at coordinates [${lat}, ${lng}].`
    );
  };

  // Start / Stop Live GPS Track Recording (Field Walk Breadcrumbs)
  const toggleLiveTrackRecording = () => {
    if (isLiveTracking) {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
      setActionNotice(`Live GPS Track recording completed! Logged ${trackPoints.length} breadcrumb points (${(trackDistanceMeters / 1000).toFixed(2)} km).`);
    } else {
      // Start tracking
      if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
      }
      setIsLiveTracking(true);
      setTrackPoints([]);
      setTrackDistanceMeters(0);
      setTrackStartTime(Date.now());
      setTrackElapsedSec(0);

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;
          const newPt: TrackPoint = {
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toLocaleTimeString(),
            speedKmh: speed ? Math.round(speed * 3.6) : 0
          };

          setUserLocation([latitude, longitude], accuracy);

          setTrackPoints((prev) => {
            if (prev.length > 0) {
              const lastPt = prev[prev.length - 1];
              const from = turf.point([lastPt.lng, lastPt.lat]);
              const to = turf.point([newPt.lng, newPt.lat]);
              const distKm = turf.distance(from, to, { units: 'kilometers' });
              setTrackDistanceMeters((d) => d + distKm * 1000);
            }
            return [...prev, newPt];
          });
        },
        (err) => console.warn('Watch error:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );

      watchIdRef.current = id;
      setActionNotice('Live GPS Track Recorder started! Walking path is now actively plotted on map.');
    }
  };

  // Convert Recorded GPS Track to a Permanent GIS Layer
  const handleSaveTrackAsGisLayer = () => {
    if (trackPoints.length < 2) return;
    const coords = trackPoints.map((p) => [p.lng, p.lat]);
    const geojson = turf.lineString(coords, {
      name: `Field GPS Survey Track (${new Date().toLocaleDateString()})`,
      distanceMeters: trackDistanceMeters,
      pointCount: trackPoints.length
    });

    addGisLayer({
      projectId: 'proj-palar-01',
      name: `GPS Survey Trail (${trackPoints.length} pts, ${(trackDistanceMeters / 1000).toFixed(2)}km)`,
      category: 'Field',
      format: 'GeoJSON',
      visible: true,
      opacity: 0.9,
      color: '#10b981',
      featureCount: trackPoints.length,
      crs: 'EPSG:4326',
      source: 'Live GPS Track Recorder',
      data: geojson,
      isOverlay: true
    });

    setActionNotice('Saved GPS breadcrumb trail into GIS Layer stack!');
  };

  // Spatial Buffer Statistics around Current GPS
  const getBufferStatistics = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    const userPt = turf.point([curGps[1], curGps[0]]);
    const radiusKm = bufferRadiusMeters / 1000;

    // Filter Wells within buffer
    const wellsInside = wells.filter((w) => {
      const wellPt = turf.point([w.lng, w.lat]);
      const dist = turf.distance(userPt, wellPt, { units: 'kilometers' });
      return dist <= radiusKm;
    });

    // Closest well
    let nearestWellDistMeters = 999999;
    wells.forEach((w) => {
      const wellPt = turf.point([w.lng, w.lat]);
      const d = turf.distance(userPt, wellPt, { units: 'kilometers' }) * 1000;
      if (d < nearestWellDistMeters) nearestWellDistMeters = d;
    });

    // MAR structures within buffer
    const marInside = marSites.filter((m) => {
      const mPt = turf.point([m.lng, m.lat]);
      const dist = turf.distance(userPt, mPt, { units: 'kilometers' });
      return dist <= radiusKm;
    });

    // Average Yield
    const avgYield =
      wellsInside.length > 0
        ? wellsInside.reduce((acc, w) => acc + (w.yieldLps || 0), 0) / wellsInside.length
        : 8.5;

    return {
      wellsInsideCount: wellsInside.length,
      nearestWellDistMeters: nearestWellDistMeters === 999999 ? 0 : Math.round(nearestWellDistMeters),
      marInsideCount: marInside.length,
      avgYieldLps: Number(avgYield.toFixed(1)),
      radiusKm
    };
  };

  const bufferStats = getBufferStatistics();

  // Export Spatial Data as GeoJSON
  const handleExportSpatialGeoJson = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    const features: any[] = [];

    // Current GPS point
    features.push(
      turf.point([curGps[1], curGps[0]], {
        name: 'Current Device GPS Position',
        elevationM: gpsTelemetry.elevationM,
        accuracyM: userLocationAccuracy,
        timestamp: new Date().toISOString()
      })
    );

    // Waypoints
    waypoints.forEach((wp) => {
      features.push(
        turf.point([wp.lng, wp.lat], {
          name: wp.label,
          type: 'GPS Waypoint',
          elevationM: wp.elevationM,
          timestamp: wp.timestamp
        })
      );
    });

    // Track
    if (trackPoints.length >= 2) {
      features.push(
        turf.lineString(
          trackPoints.map((p) => [p.lng, p.lat]),
          { name: 'Live GPS Field Track', distanceM: trackDistanceMeters }
        )
      );
    }

    // Buffer Circle
    const bufferPolygon = turf.circle([curGps[1], curGps[0]], bufferRadiusMeters / 1000, {
      units: 'kilometers',
      properties: { name: `Current GPS ${bufferRadiusMeters}m Buffer Zone` }
    });
    features.push(bufferPolygon);

    const fc = turf.featureCollection(features);
    const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydro_gps_spatial_export_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
    setActionNotice('Exported GeoJSON bundle containing Current GPS, Waypoints, and Buffer!');
  };

  // Export Spatial CSV
  const handleExportSpatialCsv = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    let csv = 'Type,Name/ID,Latitude,Longitude,Elevation_m,Accuracy_m,Timestamp\n';
    csv += `Current_GPS,Live_GPS_Location,${curGps[0]},${curGps[1]},${gpsTelemetry.elevationM || 140},${userLocationAccuracy || 10},${new Date().toISOString()}\n`;

    waypoints.forEach((wp) => {
      csv += `Waypoint,"${wp.label}",${wp.lat},${wp.lng},${wp.elevationM || 140},${wp.accuracyM || 10},"${wp.timestamp}"\n`;
    });

    wells.forEach((w) => {
      csv += `Well,"${w.wellId}",${w.lat},${w.lng},140,5,"${w.createdAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydro_gps_points_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setActionNotice('Exported spatial points CSV!');
  };

  // Direct Operations at Current GPS Location
  const handleRegisterWellAtCurrentGps = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    const newWellId = `WELL-GPS-${Math.floor(1000 + Math.random() * 9000)}`;

    addWell({
      projectId: 'proj-palar-01',
      wellId: newWellId,
      wellType: 'Borewell',
      aquiferType: 'Semi-confined',
      lat: Number(curGps[0].toFixed(5)),
      lng: Number(curGps[1].toFixed(5)),
      depthM: 55.0,
      diameterMm: 150,
      yieldLps: 6.5,
      lithology: 'Granitic Gneiss / Saprolite Aquifer',
      status: 'Active'
    });

    setActionNotice(`Registered New Well "${newWellId}" at Current GPS [${curGps[0].toFixed(5)}, ${curGps[1].toFixed(5)}]!`);
    logSystemAction('REGISTER_WELL_AT_CURRENT_GPS', 'gis', `Registered new well ${newWellId} at current GPS coordinates.`);
  };

  const handleAddFieldObservationAtCurrentGps = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    addFieldObservation({
      projectId: 'proj-palar-01',
      observerName: 'Principal Hydrogeologist',
      type: 'Hydrogeology',
      lat: Number(curGps[0].toFixed(5)),
      lng: Number(curGps[1].toFixed(5)),
      elevationM: gpsTelemetry.elevationM,
      accuracyM: userLocationAccuracy || 10,
      notes: `Field hydrogeology observation at live GPS position [${curGps[0].toFixed(5)}°N, ${curGps[1].toFixed(5)}°E]. Soil overburden weathered saprolite, high infiltration potential.`,
      syncStatus: 'synced'
    });

    setActionNotice(`Logged Field Observation at Current GPS [${curGps[0].toFixed(5)}, ${curGps[1].toFixed(5)}]!`);
  };

  const handleLogSoilSampleAtCurrentGps = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    const sampleId = `SOIL-GPS-${Math.floor(100 + Math.random() * 900)}`;

    addSoilSample({
      projectId: 'proj-palar-01',
      sampleId,
      lat: Number(curGps[0].toFixed(5)),
      lng: Number(curGps[1].toFixed(5)),
      depthCm: 45,
      date: new Date().toISOString().split('T')[0],
      texture: 'Sandy Clay Loam',
      color: 'Dark Reddish Brown (5YR 3/4)',
      structure: 'Blocky',
      moisture: 'Moist',
      gravelPercent: 12,
      organicMatterObs: 'Moderate organic humus in upper 15cm horizon',
      landUse: 'Agricultural Recharge Catchment'
    });

    setActionNotice(`Logged Soil Sample "${sampleId}" at Current GPS [${curGps[0].toFixed(5)}, ${curGps[1].toFixed(5)}]!`);
  };

  // Copy Current GPS Coordinates
  const handleCopyCurrentGpsCoordinates = () => {
    const curGps = userLocation || [12.85124, 79.01845];
    const text = `${curGps[0].toFixed(5)}, ${curGps[1].toFixed(5)}`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  // Search & Geocoding Jumper
  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchMsg(null);
    if (!searchQuery.trim()) return;

    const coordMatch = searchQuery.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setMapViewState([lat, lng], 14);
        setSearchMsg(`Flew map to coordinates [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
        return;
      }
    }

    const matchedPreset = PRESET_LOCATIONS.find((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedPreset) {
      setMapViewState(matchedPreset.center, matchedPreset.zoom);
      setSearchMsg(`Matched: ${matchedPreset.name}`);
      return;
    }

    if (searchQuery.toLowerCase().includes('vellore') || searchQuery.toLowerCase().includes('palar')) {
      setMapViewState([12.85, 79.035], 13);
    } else if (searchQuery.toLowerCase().includes('chennai')) {
      setMapViewState([13.082, 80.27], 12);
    } else if (searchQuery.toLowerCase().includes('bengaluru') || searchQuery.toLowerCase().includes('bangalore')) {
      setMapViewState([12.971, 77.594], 12);
    } else {
      setSearchMsg(`No preset found for "${searchQuery}". Enter raw coords e.g. "12.85, 79.02"`);
    }
  };

  // Measurement Stats
  const getMeasurementStats = () => {
    if (measurePoints.length < 2) return { distanceKm: 0, areaM2: 0, areaHectares: 0 };
    const turfCoords = measurePoints.map((p) => [p[1], p[0]]);
    const line = turf.lineString(turfCoords);
    const distanceKm = turf.length(line, { units: 'kilometers' });

    let areaM2 = 0;
    if (measurePoints.length >= 3) {
      const closedCoords = [...turfCoords, turfCoords[0]];
      const polygon = turf.polygon([closedCoords]);
      areaM2 = turf.area(polygon);
    }

    return {
      distanceKm,
      areaM2,
      areaHectares: areaM2 / 10000
    };
  };

  const measureStats = getMeasurementStats();

  // Drag & Drop GeoJSON Import
  const handleDropGeoJson = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsedData = JSON.parse(event.target?.result as string);
            addGisLayer({
              projectId: 'proj-palar-01',
              name: file.name.replace(/\.[^/.]+$/, ''),
              category: 'Land',
              format: 'GeoJSON',
              visible: true,
              opacity: 0.8,
              color: '#3b82f6',
              featureCount: parsedData.features ? parsedData.features.length : 1,
              crs: 'EPSG:4326',
              source: 'Drag & Drop Upload',
              data: parsedData,
              isOverlay: true
            });
            setActionNotice(`Imported GeoJSON layer "${file.name}" onto map canvas!`);
          } catch (err) {
            alert('Invalid GeoJSON syntax in dropped file.');
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const activeGpsCoords = userLocation || [12.85124, 79.01845];

  return (
    <div
      className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-950 select-none"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDropGeoJson}
    >
      {/* Drag & Drop Visual HUD */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-[2000] bg-cyan-950/85 border-4 border-dashed border-cyan-400 backdrop-blur-md flex flex-col items-center justify-center text-white space-y-3 p-6 pointer-events-none animate-pulse">
          <UploadCloud className="w-16 h-16 text-cyan-300" />
          <h2 className="text-2xl font-bold tracking-wide">Drop Spatial GeoJSON File Here</h2>
          <p className="text-sm text-cyan-200">
            Instantly render shape boundaries, aquifers, and GIS contour layers
          </p>
        </div>
      )}

      {/* Top Floating Master Action Toolbar */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-wrap items-center gap-2 max-w-[calc(100vw-24rem)]">
        {/* Search Bar / Coordinate Jumper */}
        <form
          onSubmit={handleSearchLocation}
          className="relative flex items-center bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl overflow-hidden backdrop-blur-md"
        >
          <Search className="w-4 h-4 text-slate-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search basin or coords '12.85, 79.01'..."
            className="bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 px-2.5 py-2 w-56 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-2 text-xs transition-colors"
          >
            Jump
          </button>
        </form>

        {/* 🧠 Flagship Groundwater Intelligence Live Engine Toggle */}
        <button
          onClick={() => setShowIntelligenceCard(!showIntelligenceCard)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-xl border transition-all backdrop-blur-md ${
            showIntelligenceCard
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-300 text-white shadow-cyan-500/20'
              : 'bg-slate-900/95 border-slate-700 text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle Groundwater Intelligence, Aquifer Digital Twin & AI Forecasts"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Groundwater Intel</span>
        </button>

        {/* ⚡ MASTER ACTION: Fetch Government GIS Data at Current GPS */}
        <button
          onClick={handleFetchAllGovtGisForCurrentGps}
          disabled={isFetchingGovtAll}
          className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl transition-all border border-amber-300"
          title="Fetch Survey of India Quadrangle, CGWB Telemetry Stations & Hydro Intelligence for your Current GPS"
        >
          <Zap className={`w-4 h-4 ${isFetchingGovtAll ? 'animate-spin' : 'animate-bounce'}`} />
          <span>{isFetchingGovtAll ? 'Fetching Govt GIS...' : '⚡ Fetch Govt GIS at My GPS'}</span>
        </button>

        {/* GPS Live Position Fetch Button */}
        <button
          onClick={() => handleFetchCurrentLocation(true)}
          disabled={isLocating}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-xl border transition-all backdrop-blur-md ${
            userLocation
              ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 hover:bg-cyan-900'
              : 'bg-slate-900/95 border-slate-700 text-slate-200 hover:bg-slate-800'
          }`}
          title="Fetch High-Accuracy Current Device GPS"
        >
          <Locate className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Acquiring Fix...' : 'My Live GPS'}</span>
        </button>

        {/* Live GPS Track Recorder Button */}
        <button
          onClick={toggleLiveTrackRecording}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-xl border transition-all backdrop-blur-md ${
            isLiveTracking
              ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-900/95 border-slate-700 text-slate-200 hover:bg-slate-800'
          }`}
          title="Record live walking trail breadcrumbs on map"
        >
          {isLiveTracking ? <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isLiveTracking ? `Rec ${trackElapsedSec}s (${trackPoints.length} pts)` : 'Record Walk'}</span>
        </button>

        {/* Measurement Tool Toggle */}
        <button
          onClick={() => {
            setIsMeasuring(!isMeasuring);
            if (!isMeasuring) setMeasurePoints([]);
          }}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-xl border transition-all backdrop-blur-md ${
            isMeasuring
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-900/95 border-slate-700 text-slate-200 hover:bg-slate-800'
          }`}
          title="Measure linear distance and polygon area"
        >
          <Ruler className="w-4 h-4 text-emerald-400" />
          <span>{isMeasuring ? 'Measuring' : 'Measure'}</span>
        </button>

        {/* Spatial Export Button */}
        <div className="relative group">
          <button
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900/95 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl font-semibold text-xs shadow-xl transition-all backdrop-blur-md"
            title="Export GIS and GPS Datasets"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 text-xs hidden group-hover:block z-[1500]">
            <button
              onClick={handleExportSpatialGeoJson}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded text-slate-200 flex items-center space-x-2"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export GeoJSON</span>
            </button>
            <button
              onClick={handleExportSpatialCsv}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 rounded text-slate-200 flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV Points</span>
            </button>
          </div>
        </div>

        {/* Set View as Default Button */}
        <button
          onClick={() => {
            setDefaultMapView(mapCenter, mapZoom);
            setSavedDefaultNotice(true);
            setTimeout(() => setSavedDefaultNotice(false), 2500);
          }}
          className="p-2 bg-slate-900/95 border border-slate-700 hover:bg-slate-800 text-amber-300 rounded-xl shadow-xl transition-all backdrop-blur-md"
          title="Set current view as project default"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
        </button>

        {/* Reset Camera to Default */}
        <button
          onClick={resetToDefaultMapView}
          className="p-2 bg-slate-900/95 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl shadow-xl transition-all backdrop-blur-md"
          title="Reset to default map view"
        >
          <Home className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Toggle Legend */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`p-2 rounded-xl shadow-xl border transition-all backdrop-blur-md ${
            showLegend
              ? 'bg-cyan-950 border-cyan-600 text-cyan-300'
              : 'bg-slate-900/95 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle Map Symbology Legend"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Main Left Modular GIS Control Panel */}
      <div className="absolute top-4 left-4 z-[1000] w-88 bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur-md text-slate-200 text-xs space-y-3 max-h-[calc(100vh-5.5rem)] overflow-y-auto w-84">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-bold text-slate-100">
            <MapIcon className="w-4 h-4 text-cyan-400" />
            <span>Module 4: Spatial GIS Hub</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
            WGS84 / EPSG:4326
          </span>
        </div>

        {/* Notifications & Feedback Toasts */}
        {actionNotice && (
          <div className="p-2 bg-cyan-950/90 border border-cyan-500/80 rounded-lg text-cyan-200 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="leading-snug">{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {savedDefaultNotice && (
          <div className="p-2 bg-amber-950/90 border border-amber-500/80 rounded-lg text-amber-200 text-xs font-medium flex items-center space-x-2">
            <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Saved active coordinates as default view!</span>
          </div>
        )}

        {searchMsg && (
          <div className="p-2 bg-slate-950 border border-cyan-800 rounded text-[11px] text-cyan-300 font-mono flex items-center justify-between">
            <span className="truncate">{searchMsg}</span>
            <button onClick={() => setSearchMsg(null)} className="text-slate-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {locationError && (
          <div className="p-2 bg-rose-950/90 border border-rose-800 rounded-lg text-rose-200 text-[11px] space-y-0.5">
            <div className="flex items-center justify-between font-bold">
              <span>Location Fix Notice</span>
              <button onClick={() => setLocationError(null)} className="text-rose-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-rose-300">{locationError}</p>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-semibold">
          <button
            onClick={() => setActiveSidebarTab('gps')}
            className={`py-1.5 rounded text-center transition-all ${
              activeSidebarTab === 'gps'
                ? 'bg-cyan-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My GPS
          </button>
          <button
            onClick={() => setActiveSidebarTab('govt')}
            className={`py-1.5 rounded text-center transition-all ${
              activeSidebarTab === 'govt'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Govt GIS
          </button>
          <button
            onClick={() => setActiveSidebarTab('buffer')}
            className={`py-1.5 rounded text-center transition-all ${
              activeSidebarTab === 'buffer'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Buffer
          </button>
          <button
            onClick={() => setActiveSidebarTab('layers')}
            className={`py-1.5 rounded text-center transition-all ${
              activeSidebarTab === 'layers'
                ? 'bg-indigo-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Layers
          </button>
        </div>

        {/* TAB 1: CURRENT GPS POINTS & TELEMETRY */}
        {activeSidebarTab === 'gps' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Live GPS Telemetry Card */}
            <div className="bg-cyan-950/50 border border-cyan-800/80 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-bold font-mono text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span>Current GPS Coordinates</span>
                </span>
                <span className="text-[9px] bg-cyan-900 text-cyan-200 px-1.5 py-0.5 rounded font-mono">
                  ±{userLocationAccuracy ? userLocationAccuracy.toFixed(0) : '8'}m
                </span>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-100">
                <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Latitude:</span>
                  <div className="font-bold text-cyan-300">{activeGpsCoords[0].toFixed(5)}°N</div>
                </div>
                <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Longitude:</span>
                  <div className="font-bold text-cyan-300">{activeGpsCoords[1].toFixed(5)}°E</div>
                </div>
              </div>

              {/* Secondary Telemetry: Elevation, Speed, Fix */}
              <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-slate-300 bg-slate-900/70 p-1.5 rounded border border-slate-800">
                <div>
                  <span className="text-slate-500">Elev:</span> {gpsTelemetry.elevationM}m MSL
                </div>
                <div>
                  <span className="text-slate-500">Speed:</span> {gpsTelemetry.speedKmh} km/h
                </div>
                <div>
                  <span className="text-slate-500">Fix:</span> {gpsTelemetry.lastFixTime}
                </div>
              </div>

              {copiedNotice && (
                <p className="text-[10px] text-emerald-400 font-bold font-mono">
                  ✓ Current GPS coordinates copied to clipboard!
                </p>
              )}

              {/* Quick Actions for Current GPS */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={handleRegisterWellAtCurrentGps}
                  className="py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-[10px] flex items-center justify-center space-x-1 transition-colors"
                  title="Register new well at your current GPS location"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>+ Register Well</span>
                </button>

                <button
                  onClick={handleAddFieldObservationAtCurrentGps}
                  className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] flex items-center justify-center space-x-1 transition-colors"
                  title="Log field hydrogeology observation at your current GPS"
                >
                  <FileText className="w-3 h-3" />
                  <span>+ Field Note</span>
                </button>

                <button
                  onClick={handleLogSoilSampleAtCurrentGps}
                  className="py-1 px-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[10px] flex items-center justify-center space-x-1 transition-colors"
                  title="Record soil specimen at your current GPS"
                >
                  <Droplets className="w-3 h-3" />
                  <span>+ Soil Sample</span>
                </button>

                <button
                  onClick={handleCopyCurrentGpsCoordinates}
                  className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-[10px] flex items-center justify-center space-x-1 transition-colors border border-slate-700"
                >
                  <Copy className="w-3 h-3 text-cyan-400" />
                  <span>Copy Coords</span>
                </button>
              </div>

              {/* Center Map on GPS */}
              <button
                onClick={() => setMapViewState(activeGpsCoords, 16)}
                className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded text-[10px] flex items-center justify-center space-x-1 border border-slate-700"
              >
                <Navigation className="w-3 h-3" />
                <span>Fly Camera To Current GPS</span>
              </button>
            </div>

            {/* Waypoints Capture & Log */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 font-mono">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Field GPS Waypoints ({waypoints.length})</span>
                </span>
                <button
                  onClick={() => setShowWaypointModal(true)}
                  className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold hover:bg-emerald-900"
                >
                  + Capture Waypoint
                </button>
              </div>

              {showWaypointModal && (
                <div className="bg-slate-900 p-2 rounded border border-emerald-700 space-y-1.5">
                  <label className="text-[10px] text-slate-300">Waypoint Label / Description:</label>
                  <input
                    type="text"
                    value={waypointLabelInput}
                    onChange={(e) => setWaypointLabelInput(e.target.value)}
                    placeholder="e.g. Infiltration Piezometer #4"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                  <div className="flex justify-end space-x-1 pt-1">
                    <button
                      onClick={() => setShowWaypointModal(false)}
                      className="px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCaptureCurrentGpsWaypoint}
                      className="px-2 py-0.5 text-[10px] bg-emerald-600 text-slate-950 font-bold rounded"
                    >
                      Save Point
                    </button>
                  </div>
                </div>
              )}

              {waypoints.length > 0 ? (
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {waypoints.map((wp) => (
                    <div
                      key={wp.id}
                      onClick={() => setMapViewState([wp.lat, wp.lng], 16)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-emerald-300 truncate">{wp.label}</div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {wp.lat.toFixed(4)}°N, {wp.lng.toFixed(4)}°E • {wp.timestamp}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWaypoints(waypoints.filter((w) => w.id !== wp.id));
                        }}
                        className="text-slate-500 hover:text-rose-400 p-0.5 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">
                  No waypoints captured yet. Click "+ Capture Waypoint" to log field spots.
                </p>
              )}
            </div>

            {/* Live Breadcrumb Track Recorder Info */}
            {isLiveTracking && (
              <div className="bg-rose-950/60 border border-rose-700/80 p-2.5 rounded-lg space-y-1.5 text-rose-200">
                <div className="flex items-center justify-between font-bold text-[11px] font-mono">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                    <span>Live GPS Track Recording</span>
                  </span>
                  <span>{trackElapsedSec}s</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                  <div className="bg-slate-900/90 p-1 rounded">
                    Distance: <strong className="text-white">{(trackDistanceMeters / 1000).toFixed(2)} km</strong>
                  </div>
                  <div className="bg-slate-900/90 p-1 rounded">
                    Points: <strong className="text-white">{trackPoints.length}</strong>
                  </div>
                </div>
                <div className="flex space-x-1 pt-1">
                  <button
                    onClick={handleSaveTrackAsGisLayer}
                    className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px]"
                  >
                    Save As Layer
                  </button>
                  <button
                    onClick={toggleLiveTrackRecording}
                    className="py-1 px-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded text-[10px]"
                  >
                    Stop Track
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CENTRAL GOVT GIS DATA FETCHED AT CURRENT GPS */}
        {activeSidebarTab === 'govt' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Master Trigger Banner */}
            <button
              onClick={handleFetchAllGovtGisForCurrentGps}
              disabled={isFetchingGovtAll}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-between transition-all shadow-lg border border-amber-300"
            >
              <span className="flex items-center space-x-1.5">
                <Zap className={`w-4 h-4 ${isFetchingGovtAll ? 'animate-spin' : ''}`} />
                <span>Fetch Govt GIS for Current GPS</span>
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-200 px-1.5 py-0.5 rounded font-mono">
                Auto-Pin
              </span>
            </button>

            {/* Individual API Fetch Buttons */}
            <div className="space-y-1.5">
              <button
                onClick={handleFetchSoiDataForGps}
                disabled={isFetchingSoi}
                className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded text-[11px] flex items-center justify-between border border-amber-900/60"
              >
                <span className="flex items-center space-x-1.5">
                  <SoiIcon className={`w-3.5 h-3.5 ${isFetchingSoi ? 'animate-spin' : ''}`} />
                  <span>Fetch SOI Quadrangle at GPS</span>
                </span>
                <span className="text-[9px] bg-amber-950 px-1 rounded font-mono">1:50,000</span>
              </button>

              <button
                onClick={handleFetchCgwbDataForGps}
                disabled={isFetchingCgwb}
                className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded text-[11px] flex items-center justify-between border border-cyan-900/60"
              >
                <span className="flex items-center space-x-1.5">
                  <Radio className={`w-3.5 h-3.5 ${isFetchingCgwb ? 'animate-spin' : ''}`} />
                  <span>Fetch CGWB Telemetry at GPS</span>
                </span>
                <span className="text-[9px] bg-cyan-950 px-1 rounded font-mono">Piezometers</span>
              </button>
            </div>

            {/* Location Intelligence Card for Current GPS */}
            {locationIntelligence && (
              <div className="bg-slate-950 p-2.5 rounded-lg border border-amber-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-amber-300 font-bold font-mono text-[11px]">
                  <span>Groundwater Potential at GPS</span>
                  <span className="text-[10px] bg-amber-950 text-amber-200 px-1.5 py-0.5 rounded">
                    Score: {locationIntelligence.gwpzScore}/100
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {locationIntelligence.gwpzClass}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-slate-300 bg-slate-900 p-1.5 rounded">
                  <div>
                    <span className="text-slate-500">SOI Sheet:</span> {locationIntelligence.soiSheet}
                  </div>
                  <div>
                    <span className="text-slate-500">Elevation:</span> {locationIntelligence.elevationM}m
                  </div>
                  <div>
                    <span className="text-slate-500">Hyd. Cond (K):</span> {locationIntelligence.hydraulicConductivityMDay} m/d
                  </div>
                  <div>
                    <span className="text-slate-500">Rainfall:</span> {locationIntelligence.annualRainfallMm} mm/yr
                  </div>
                </div>
                <div className="text-[9px] text-cyan-300 font-medium">
                  <strong>Recommended MAR:</strong> {locationIntelligence.recommendedMarStructure}
                </div>
              </div>
            )}

            {/* Pinned Govt Features List */}
            {govtPins.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold font-mono">
                  <span>Govt Pins Surrounding GPS ({govtPins.length})</span>
                  <button
                    onClick={() => setGovtPins([])}
                    className="text-slate-500 hover:text-slate-300 text-[9px]"
                  >
                    Clear Pins
                  </button>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {govtPins.map((pin) => (
                    <div
                      key={pin.id}
                      onClick={() => setMapViewState([pin.lat, pin.lng], 15)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="truncate pr-1">
                        <p className="font-semibold text-slate-200 truncate">{pin.title}</p>
                        <p className="text-[9px] text-slate-400 font-mono">
                          {pin.lat.toFixed(3)}°N, {pin.lng.toFixed(3)}°E • {pin.distanceKm !== undefined ? `${pin.distanceKm} km away` : pin.category}
                        </p>
                      </div>
                      <Navigation className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SPATIAL BUFFER RADIUS ANALYSIS */}
        {activeSidebarTab === 'buffer' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="bg-emerald-950/60 border border-emerald-800 p-2.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-emerald-300 font-bold font-mono text-[11px]">
                <span className="flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>GPS Buffer Analysis</span>
                </span>
                <span className="text-[10px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                  {bufferRadiusMeters >= 1000 ? `${(bufferRadiusMeters / 1000).toFixed(1)} km` : `${bufferRadiusMeters} m`}
                </span>
              </div>

              {/* Radius Selector Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>250m</span>
                  <span>1 km</span>
                  <span>2.5 km</span>
                  <span>5 km</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="5000"
                  step="250"
                  value={bufferRadiusMeters}
                  onChange={(e) => setBufferRadiusMeters(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Live Statistics inside Buffer */}
              <div className="space-y-1.5 font-mono text-[10px] text-slate-200 bg-slate-900/90 p-2 rounded border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Wells Inside Radius:</span>
                  <span className="font-bold text-emerald-300">{bufferStats.wellsInsideCount} stations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nearest Well Distance:</span>
                  <span className="font-bold text-cyan-300">{bufferStats.nearestWellDistMeters} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MAR Recharge Sites:</span>
                  <span className="font-bold text-amber-300">{bufferStats.marInsideCount} structures</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-400">Average Aquifer Yield:</span>
                  <span className="font-bold text-emerald-400">{bufferStats.avgYieldLps} L/s</span>
                </div>
              </div>

              {/* Water Table Heatmap Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-300">Groundwater Heatmap Surface</span>
                <button
                  onClick={() => setShowWaterTableHeatmap(!showWaterTableHeatmap)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    showWaterTableHeatmap ? 'bg-cyan-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {showWaterTableHeatmap ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GIS LAYERS & BASEMAP STACK */}
        {activeSidebarTab === 'layers' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Basemap Tile Switcher */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                Basemap Tile Layer
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['osm', 'satellite', 'terrain'] as const).map((tile) => (
                  <button
                    key={tile}
                    onClick={() => setBasemapTile(tile)}
                    className={`py-1 rounded text-[10px] font-semibold border transition-all text-center capitalize ${
                      basemapTile === tile
                        ? 'bg-cyan-600 border-cyan-400 text-slate-950 font-bold shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {tile}
                  </button>
                ))}
              </div>
            </div>

            {/* GIS Layers Stack */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                <span>GIS Vector Layers ({gisLayers.length})</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {gisLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className="p-1.5 bg-slate-800/80 rounded border border-slate-700 flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        ></span>
                        <span className="truncate text-[10px] font-medium text-slate-200">{layer.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleLayerOverlay(layer.id)}
                          className={`px-1 py-0.2 rounded text-[8px] font-mono font-bold ${
                            layer.isOverlay ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-slate-500'
                          }`}
                        >
                          {layer.isOverlay ? 'Overlay' : 'Normal'}
                        </button>
                        <button
                          onClick={() => toggleLayerVisibility(layer.id)}
                          className="p-0.5 text-slate-400 hover:text-white"
                        >
                          {layer.visible ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preset Basins Quick Jumpers */}
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
            Research Basin Preset Jump
          </label>
          <div className="grid grid-cols-2 gap-1">
            {PRESET_LOCATIONS.slice(0, 4).map((loc) => (
              <button
                key={loc.name}
                onClick={() => setMapViewState(loc.center, loc.zoom)}
                className="text-left px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[9px] text-slate-300 truncate"
                title={loc.name}
              >
                {loc.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Attributes Modal HUD */}
        {activeFeatureInfo && (
          <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-slate-800 pb-1">
              <span className="flex items-center space-x-1">
                <Info className="w-3.5 h-3.5" />
                <span>Feature Attributes</span>
              </span>
              <button
                onClick={() => setActiveFeatureInfo(null)}
                className="text-slate-400 hover:text-white text-[10px]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-0.5 font-mono text-[10px] text-slate-300 max-h-32 overflow-y-auto">
              {Object.entries(activeFeatureInfo).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500 capitalize">{k}:</span>
                  <span className="font-semibold text-slate-200">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Symbology Legend (Bottom Right) */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 z-[1000] w-64 bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur-md text-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-100 border-b border-slate-800 pb-1.5">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Symbology Legend</span>
            </span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-slate-400 hover:text-white text-[10px]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {/* Live GPS Pin Key */}
            <div className="flex items-center justify-between bg-cyan-950/70 p-1.5 rounded border border-cyan-800">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-bold text-cyan-200">Current GPS Position</span>
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">Live Fix</span>
            </div>

            {/* GPS Waypoints */}
            {waypoints.length > 0 && (
              <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span>Captured GPS Waypoint</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">{waypoints.length}</span>
              </div>
            )}

            {/* Govt API Pins */}
            {govtPins.length > 0 && (
              <div className="flex items-center justify-between bg-amber-950/60 p-1.5 rounded border border-amber-800">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
                  <span className="text-amber-200">Govt Telemetry Pin</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono">{govtPins.length}</span>
              </div>
            )}

            {/* Active Wells */}
            <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-sky-400 border border-sky-600"></span>
                <span>Active Monitoring Well</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{wells.length}</span>
            </div>

            {/* MAR Sites */}
            <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span>
                <span>MAR Recharge Structure</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{marSites.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Leaflet Map Viewport Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapViewUpdater center={mapCenter} zoom={mapZoom} />
        <MousePositionHUD />
        <MapClickListener
          isMeasuring={isMeasuring}
          onAddPoint={(pt) => setMeasurePoints((prev) => [...prev, pt])}
        />

        {/* Basemap Tile Layer */}
        <TileLayer
          url={BASEMAPS[basemapTile].url}
          attribution={BASEMAPS[basemapTile].attribution}
          maxZoom={19}
        />

        {/* Groundwater Level Heatmap Mock Surface Layer */}
        {showWaterTableHeatmap && (
          <Circle
            center={activeGpsCoords}
            radius={bufferRadiusMeters * 1.6}
            pathOptions={{
              fillColor: '#0ea5e9',
              fillOpacity: 0.12,
              color: '#0284c7',
              weight: 1,
              dashArray: '4, 8'
            }}
          />
        )}

        {/* 1. CURRENT GPS LOCATION PIN (Primary Feature) */}
        {userLocation && (
          <>
            {/* Accuracy Halo Circle */}
            <Circle
              center={userLocation}
              radius={userLocationAccuracy || 15}
              pathOptions={{
                fillColor: '#06b6d4',
                fillOpacity: 0.18,
                color: '#0891b2',
                weight: 1.5,
                dashArray: '3, 6'
              }}
            />

            {/* Spatial Buffer Radius Analysis Circle */}
            {showBufferAnalysis && (
              <Circle
                center={userLocation}
                radius={bufferRadiusMeters}
                pathOptions={{
                  fillColor: '#10b981',
                  fillOpacity: 0.08,
                  color: '#10b981',
                  weight: 2,
                  dashArray: '6, 6'
                }}
              />
            )}

            {/* High-Accuracy Pulsing Current GPS Marker */}
            <Marker position={userLocation} icon={currentGpsPulsingIcon}>
              <Popup className="custom-popup">
                <div className="p-2 space-y-1.5 text-xs">
                  <div className="font-bold text-cyan-700 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Your Current GPS Location</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 bg-slate-100 p-1.5 rounded">
                    <div>Lat: {userLocation[0].toFixed(5)}°N</div>
                    <div>Lng: {userLocation[1].toFixed(5)}°E</div>
                    <div>Accuracy: ±{userLocationAccuracy?.toFixed(0) || '8'}m</div>
                    <div>Elevation: {gpsTelemetry.elevationM}m MSL</div>
                  </div>
                  <div className="flex space-x-1 pt-1">
                    <button
                      onClick={handleRegisterWellAtCurrentGps}
                      className="px-2 py-1 bg-cyan-600 text-white font-bold rounded text-[10px]"
                    >
                      + Well
                    </button>
                    <button
                      onClick={handleAddFieldObservationAtCurrentGps}
                      className="px-2 py-1 bg-emerald-600 text-white font-bold rounded text-[10px]"
                    >
                      + Note
                    </button>
                    <button
                      onClick={handleFetchAllGovtGisForCurrentGps}
                      className="px-2 py-1 bg-amber-600 text-white font-bold rounded text-[10px]"
                    >
                      ⚡ Govt GIS
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 2. LIVE GPS TRACK BREADCRUMB POLYLINES */}
        {trackPoints.length >= 2 && (
          <Polyline
            positions={trackPoints.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: '#10b981', weight: 4, opacity: 0.9 }}
          />
        )}

        {/* 3. CAPTURED GPS WAYPOINTS */}
        {waypoints.map((wp) => (
          <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={waypointPinIcon}>
            <Popup>
              <div className="p-1.5 text-xs font-sans space-y-1">
                <div className="font-bold text-emerald-700">{wp.label}</div>
                <div className="font-mono text-[10px] text-slate-600">
                  {wp.lat.toFixed(5)}°N, {wp.lng.toFixed(5)}°E
                </div>
                <div className="text-[9px] text-slate-500">Logged: {wp.timestamp}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. GOVERNMENT API AUTO-PINNED COORDINATES */}
        {govtPins.map((pin) => (
          <CircleMarker
            key={pin.id}
            center={[pin.lat, pin.lng]}
            radius={8}
            pathOptions={{
              fillColor: '#f59e0b',
              fillOpacity: 0.9,
              color: '#ffffff',
              weight: 2
            }}
          >
            <Popup>
              <div className="p-2 space-y-1 text-xs font-sans">
                <div className="font-bold text-amber-800">{pin.title}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Source: {pin.source}
                </div>
                <div className="font-mono text-[10px] text-slate-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                  {pin.lat.toFixed(4)}°N, {pin.lng.toFixed(4)}°E
                  {pin.distanceKm !== undefined && <div>Distance to GPS: {pin.distanceKm} km</div>}
                </div>
                <p className="text-[11px] text-slate-700">{pin.details}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 5. ACTIVE WELLS */}
        {wells.map((well) => (
          <CircleMarker
            key={well.id}
            center={[well.lat, well.lng]}
            radius={6}
            pathOptions={{
              fillColor: well.status === 'Active' ? '#38bdf8' : '#94a3b8',
              fillOpacity: 0.85,
              color: '#ffffff',
              weight: 1.5
            }}
          >
            <Popup>
              <div className="p-1.5 space-y-1 text-xs">
                <div className="font-bold text-sky-800">{well.wellId} ({well.wellType})</div>
                <div className="font-mono text-[10px] text-slate-600">
                  Depth: {well.depthM}m | Yield: {well.yieldLps} L/s
                </div>
                <div className="text-[10px] text-slate-500">Aquifer: {well.aquiferType}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 6. MAR RECHARGE SITES */}
        {marSites.map((site) => (
          <CircleMarker
            key={site.id}
            center={[site.lng ? site.lat : 12.85, site.lng ? site.lng : 79.02]}
            radius={7}
            pathOptions={{
              fillColor: '#10b981',
              fillOpacity: 0.9,
              color: '#ffffff',
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1.5 text-xs">
                <div className="font-bold text-emerald-800">{site.siteName}</div>
                <div className="text-[10px] text-slate-600">{site.recommendedStructure}</div>
                <div className="text-[10px] font-mono text-emerald-700">Suitability Score: {site.suitabilityScore}/100</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 7. GIS VECTOR OVERLAY LAYERS */}
        {gisLayers
          .filter((l) => l.visible && l.data)
          .map((layer) => (
            <GeoJSON
              key={layer.id}
              data={layer.data}
              style={{
                color: layer.color,
                weight: layer.isOverlay ? 2.5 : 1.5,
                opacity: layer.opacity,
                fillColor: layer.color,
                fillOpacity: layer.isOverlay ? layer.opacity * 0.35 : layer.opacity * 0.2
              }}
              onEachFeature={(feature, leafletLayer) => {
                leafletLayer.on('click', () => {
                  setActiveFeatureInfo(feature.properties || { layerName: layer.name });
                });
              }}
            />
          ))}

        {/* 8. INTERACTIVE MEASUREMENT POLYLINES & POLYGON */}
        {isMeasuring && measurePoints.length > 0 && (
          <>
            <Polyline
              positions={measurePoints}
              pathOptions={{ color: '#10b981', weight: 3, dashArray: '5, 5' }}
            />
            {measurePoints.length >= 3 && (
              <Polygon
                positions={measurePoints}
                pathOptions={{ fillColor: '#10b981', fillOpacity: 0.2, color: '#10b981', weight: 1.5 }}
              />
            )}
            {measurePoints.map((pt, idx) => (
              <CircleMarker
                key={`measure-pt-${idx}`}
                center={pt}
                radius={5}
                pathOptions={{ fillColor: '#10b981', color: '#ffffff', weight: 2 }}
              />
            ))}
          </>
        )}
        {/* 9. GROUNDWATER INTELLIGENCE OBSERVATION WELLS */}
        {allObservations.map((obs) => {
          const depth = obs.normalizedDepthMbgl ?? obs.rawValue ?? 5.0;
          const markerColor =
            depth < 8 ? '#06b6d4' : depth < 18 ? '#10b981' : depth < 30 ? '#f59e0b' : '#f43f5e';

          return (
            <CircleMarker
              key={obs.sourceWellId}
              center={[obs.latitude, obs.longitude]}
              radius={7}
              pathOptions={{
                fillColor: markerColor,
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 2
              }}
              eventHandlers={{
                click: () => {
                  setSelectedWellObservation(obs);
                  setActiveModal('well');
                }
              }}
            >
              <Popup>
                <div className="p-2 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="text-cyan-700">{obs.sourceWellId}</span>
                    <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1 rounded font-mono">
                      {obs.agencyName}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] bg-slate-100 p-1.5 rounded space-y-0.5 text-slate-700">
                    <div>Water Table: <strong className="text-cyan-700">{depth.toFixed(2)} mbgl</strong></div>
                    <div>Elevation: {obs.groundElevationMsl ?? 148}m MSL</div>
                    <div>Aquifer: {obs.aquiferType || 'Basement Fractured Aquifer'}</div>
                    <div>Quality: {obs.qualityFlag.toUpperCase()} ({obs.qualityScore}%)</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedWellObservation(obs);
                      setActiveModal('well');
                    }}
                    className="w-full py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded text-[10px] transition-colors"
                  >
                    Open Deep Telemetry & Log
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* 10. IDW / TIN INTERPOLATED RASTER CONTOUR SURFACES */}
        {interpolatedSurfaces
          .filter((s) => s.visible)
          .map((surface) =>
            surface.contoursGeoJson ? (
              <GeoJSON
                key={surface.id}
                data={surface.contoursGeoJson}
                style={{
                  color: surface.parameter === 'water_level' ? '#06b6d4' : '#10b981',
                  weight: 2,
                  opacity: surface.opacity
                }}
              />
            ) : null
          )}
      </MapContainer>

      {/* FLOATING GROUNDWATER INTELLIGENCE CARD OVERLAY */}
      {showIntelligenceCard && (
        <div className="absolute top-16 right-4 z-[1000] w-96 max-h-[calc(100vh-5.5rem)] overflow-y-auto animate-fadeIn">
          <GroundwaterIntelligenceCard
            intelligence={groundwaterIntelligence}
            gpsTelemetry={{
              lat: activeGpsCoords[0],
              lng: activeGpsCoords[1],
              accuracyM: userLocationAccuracy || 10,
              elevationMsl: gpsTelemetry?.elevationM || 148,
              speedKmh: gpsTelemetry?.speedKmh || 0,
              headingDeg: gpsTelemetry?.headingDeg || 0,
              timestamp: new Date().toISOString(),
              quality: 'High (Dual-Band GPS)'
            }}
            loading={isLoadingIntelligence}
            selectedRadiusKm={selectedIntelligenceRadius}
            onRadiusChange={(radiusKm) => {
              setSelectedIntelligenceRadius(radiusKm);
              handleRunGroundwaterIntelligence(radiusKm);
            }}
            onRefresh={() => handleRunGroundwaterIntelligence()}
            onOpenTimeMachine={() => setActiveModal('timemachine')}
            onOpenStressIndex={() => setActiveModal('stress')}
            onOpenMlForecast={() => setActiveModal('ml')}
            onOpenRainfallRecharge={() => setActiveModal('rainfall')}
            onOpenMarRecommendation={() => setActiveModal('mar')}
            onOpenAnomalies={() => setActiveModal('anomalies')}
            onOpenWatershed={() => setActiveModal('watershed')}
            onOpenContamination={() => setActiveModal('contamination')}
            onOpen3dSubsurface={() => setActiveModal('3d')}
            onOpenSurfaceGenerator={() => setActiveModal('surface')}
          />
        </div>
      )}

      {/* ANALYTICAL MODALS SUITE */}
      {activeModal === 'well' && (
        <WellIntelligenceModal
          observation={selectedWellObservation}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'timemachine' && (
        <TimeMachineModal
          onClose={() => setActiveModal('none')}
          onYearChange={(yr) => setTimeMachineYear(yr)}
        />
      )}

      {activeModal === 'stress' && (
        <StressIndexModal
          currentDepthMbgl={groundwaterIntelligence?.estimatedWaterLevelMbgl ?? 5.0}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'ml' && (
        <MlForecastModal
          currentDepthMbgl={groundwaterIntelligence?.estimatedWaterLevelMbgl ?? 5.0}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'rainfall' && (
        <RainfallRechargeModal
          lat={activeGpsCoords[0]}
          lng={activeGpsCoords[1]}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'mar' && (
        <MarRecommendationModal
          lat={activeGpsCoords[0]}
          lng={activeGpsCoords[1]}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'anomalies' && (
        <AnomalyAlertsModal
          anomalies={detectedAnomalies}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'watershed' && (
        <WatershedModal
          lat={activeGpsCoords[0]}
          lng={activeGpsCoords[1]}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'contamination' && (
        <ContaminationModal
          depthMbgl={groundwaterIntelligence?.estimatedWaterLevelMbgl ?? 5.0}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === '3d' && (
        <Subsurface3DModal
          waterLevelMbgl={groundwaterIntelligence?.estimatedWaterLevelMbgl ?? 5.0}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'surface' && (
        <SurfaceGeneratorModal
          observations={allObservations}
          bounds={[
            activeGpsCoords[0] - 0.15,
            activeGpsCoords[1] - 0.15,
            activeGpsCoords[0] + 0.15,
            activeGpsCoords[1] + 0.15
          ]}
          onClose={() => setActiveModal('none')}
          onSurfaceGenerated={(surface) => {
            setInterpolatedSurfaces((prev) => [...prev, surface]);
            setActionNotice(`Generated ${surface.name} surface layer!`);
            setTimeout(() => setActionNotice(null), 3000);
          }}
        />
      )}

      {activeModal === 'compare' && (
        <WellComparisonModal
          observations={allObservations}
          onClose={() => setActiveModal('none')}
        />
      )}
    </div>
  );
};
