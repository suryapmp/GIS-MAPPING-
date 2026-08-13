export interface GeologyInfo {
  geologicalFormation: string;
  stratigraphicAge: string;
  majorLithology: string;
  weatheringGrade: string;
  fractureIntensity: string;
  hydraulicConductivityMDay: number;
  specificYield: number;
  lineamentDensityKm2: number;
  structuralFeatures: string;
}

export class GeologyProvider {
  name = 'Geological Survey & Aquifer Mapping Provider';

  async getGeologyAtLocation(lat: number, lng: number): Promise<GeologyInfo> {
    // Determine geological domain from coordinates
    const isPeninsular = lat < 21.0;
    
    if (isPeninsular) {
      return {
        geologicalFormation: 'Archaean Peninsular Gneissic Complex (PGC-II)',
        stratigraphicAge: 'Neoarchaean to Palaeoproterozoic (2.9 - 2.5 Ga)',
        majorLithology: 'Hornblende-Biotite Gneiss with Pegmatite & Quartz Vein Intrusions',
        weatheringGrade: 'Saprolite (Grade III) overlying fractured basement (Grade II)',
        fractureIntensity: 'Moderate to High with conjugate E-W and NE-SW lineaments',
        hydraulicConductivityMDay: 6.8,
        specificYield: 0.035,
        lineamentDensityKm2: 1.84,
        structuralFeatures: 'Sub-vertical fracture planes creating anisotropic secondary permeability'
      };
    } else {
      return {
        geologicalFormation: 'Quaternary Indo-Gangetic Alluvial Sequence / Vindhyan Supergroup',
        stratigraphicAge: 'Holocene to Pleistocene Alluvium over Proterozoic Bedrock',
        majorLithology: 'Fine to Coarse Fluvial Sand, Silt, and Interbedded Clay Lenses',
        weatheringGrade: 'Unconsolidated Porous Media',
        fractureIntensity: 'Porous Intergranular Matrix (Primary Porosity)',
        hydraulicConductivityMDay: 28.5,
        specificYield: 0.16,
        lineamentDensityKm2: 0.45,
        structuralFeatures: 'High-yielding unconfined to semi-confined multi-layered aquifer system'
      };
    }
  }
}

export const geologyProvider = new GeologyProvider();
