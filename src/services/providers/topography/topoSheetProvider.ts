export interface TopoSheetInfo {
  sheetNumber: string;
  baseDegreeSheet: string;
  subSheet: string;
  scale: string;
  openSeriesCode: string;
  boundingBox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  quadrantName: string;
}

export class TopoSheetProvider {
  name = 'Survey of India Open Series TopoSheet Quadrangle Engine';

  resolveFromCoordinates(lat: number, lng: number): TopoSheetInfo {
    // 4x4 degree sheet calculation for India index
    const degLat = Math.floor(lat / 4);
    const degLng = Math.floor((lng - 68) / 4);
    const baseSheet = Math.min(92, Math.max(40, 50 + degLat * 6 + degLng));
    
    // 1x1 degree subdivision (A-P)
    const latRem = Math.max(0, lat % 4);
    const lngRem = Math.max(0, (lng - 68) % 4);
    const subRow = Math.floor(latRem);
    const subCol = Math.floor(lngRem);
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];
    const letterIdx = Math.min(15, Math.max(0, (3 - subRow) * 4 + subCol));
    const subLetter = letters[letterIdx] || 'P';

    // 15' x 15' quadrant (1 to 16)
    const minLatSub = (latRem - subRow) * 60;
    const minLngSub = (lngRem - subCol) * 60;
    const qRow = Math.floor(minLatSub / 15);
    const qCol = Math.floor(minLngSub / 15);
    const quadrantNum = Math.min(16, Math.max(1, (3 - qRow) * 4 + qCol + 1));

    // Bounding 15'x15' quadrangle box
    const boxMinLat = Math.floor(lat * 4) / 4;
    const boxMaxLat = Number((boxMinLat + 0.25).toFixed(4));
    const boxMinLng = Math.floor(lng * 4) / 4;
    const boxMaxLng = Number((boxMinLng + 0.25).toFixed(4));

    const sheetNo = `${baseSheet}${subLetter}/${quadrantNum}`;

    return {
      sheetNumber: sheetNo,
      baseDegreeSheet: `${baseSheet}`,
      subSheet: `${baseSheet}${subLetter}`,
      scale: '1:50,000',
      openSeriesCode: `OSM-${sheetNo}`,
      boundingBox: {
        minLat: boxMinLat,
        maxLat: boxMaxLat,
        minLng: boxMinLng,
        maxLng: boxMaxLng
      },
      quadrantName: `SOI TopoSheet ${sheetNo} (15' x 15' Quadrangle)`
    };
  }
}

export const topoSheetProvider = new TopoSheetProvider();
