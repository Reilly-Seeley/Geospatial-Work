/***********************************************************************
 *  McKenzie River Watershed (OR) – Multidecadal NDVI‑Change Analysis  *
 *  ------------------------------------------------------------------ *
 *  Periods analyzed: 1997→2002, 2003→2009, 2010→2016                  *
 *  Sensors:   Landsat‑5 TM   (Collection‑2 L2)                        *
 *             Landsat‑7 ETM+ (Collection‑2 L2)                        *
 *  Metric:    ΔNDVI  (mean NDVI_year2 − mean NDVI_year1)              *
 *  Region:    14‑km buffer around Hogg Pass SNOTEL, clipped to HUC‑8  *
 *             17090004 (upper McKenzie River), Oregon, USA            *
 *  ------------------------------------------------------------------ *
 *  Notes                                                              *
 *  ‑ Uses Landsat Collection‑2 Level‑2 SR. Old C01 IDs have been      *
 *    replaced, and SR band names/QA bits updated accordingly.         *
 *  ‑ Helper functions (maskL57, addNDVI, loadYear) are generic enough *
 *    for Landsat‑4/5/7 SR imagery.                                    *
 **********************************************************************/

/*************************  CONSTANTS  **************************/

// HUC‑8 code for upper McKenzie River
var HUC8_CODE = '17090004';

// Buffer radius around SNOTEL, metres
var BUFFER_M = 14e3;

// NDVI visualization palette
var NDVI_PALETTE = ['red', 'white', 'blue'];


/**************** REGION & REFERENCE GEOMETRIES ****************/

//  Watershed boundary 
var huc8 = ee.FeatureCollection('USGS/WBD/2017/HUC08')
              .filter(ee.Filter.eq('huc8', HUC8_CODE));
Map.addLayer(huc8, {}, 'HUC‑8 watershed');

//  Hogg Pass SNOTEL location 
var snotel = ee.Geometry.Point([-121.85, 44.4167]);
Map.addLayer(snotel, {color: 'red'}, 'Hogg Pass SNOTEL');

//  McKenzie River gauge
var gauge  = ee.Geometry.Point([-121.99389, 44.35139]);
Map.addLayer(gauge,  {color: 'yellow'}, 'McKenzie gauge');
Map.centerObject(gauge, 10);

//  Analysis region
var region = snotel.buffer(BUFFER_M).intersection(huc8);


/********************** HELPER FUNCTIONS  ***********************/

//  Cloud‑&‑shadow mask for Landsat 4‑7 Collection‑2 L2 SR 
function maskL57(img) {
  var qa = img.select('QA_PIXEL');
  var cloud  = qa.bitwiseAnd(1 << 3).eq(0);   // bit 3  → cloud
  var shadow = qa.bitwiseAnd(1 << 4).eq(0);   // bit 4  → shadow
  return img.updateMask(cloud).updateMask(shadow);
}

// Append NDVI band using C‑2 SR_B4 (NIR) & SR_B3 (RED)
function addNDVI(img) {
  return img.addBands(
    img.normalizedDifference(['SR_B4', 'SR_B3']).rename('NDVI')
  );
}

/*
 * Convenience loader: one calendar year of Landsat 5/7 SR imagery
 * @param {number} year  – 4‑digit year (e.g. 2002)
 * @param {string} sensor – 'LT05' or 'LE07'
 * @return {ee.ImageCollection} masked & NDVI‑augmented collection
 */
function loadYear(year, sensor) {
  var id = sensor === 'LT05'
            ? 'LANDSAT/LT05/C02/T1_L2'
            : 'LANDSAT/LE07/C02/T1_L2';
  return ee.ImageCollection(id)
            .filterBounds(region)
            .filterDate(year + '-01-01', year + '-12-31')
            .map(maskL57)
            .map(addNDVI);
}

/*
 * Compute and display mean ΔNDVI for a two‑year window.
 * Print histogram & average value
 */
function analyseDelta(year1, year2, sensor, label) {
  var img1 = loadYear(year1, sensor).mean().select('NDVI');
  var img2 = loadYear(year2, sensor).mean().select('NDVI');

  var delta = img2.subtract(img1)                 // img2 − img1
                  .rename('NDVI_change')
                  .clip(region);

  // Map layer
  Map.addLayer(delta, {min:-0.5, max:0.5, palette: NDVI_PALETTE}, label);

  // Region mean
  var mean = delta.reduceRegion({
               reducer: ee.Reducer.mean(),
               geometry: region,
               scale: 30,
               bestEffort: true
             }).get('NDVI_change');
  print(['Average ' + label + ':', mean]);

  // Histogram
  var hist = ui.Chart.image.histogram({
               image: delta, region: region, scale: 30, maxBuckets: 30
             }).setOptions({
               title: label + ' Histogram',
               hAxis: {title: 'ΔNDVI'},
               vAxis: {title: 'Frequency'}
             });
  print(hist);
}


/********************** RUN ANALYSES  **************************/
// 1997 → 2002 (Landsat‑5)
analyseDelta(1997, 2002, 'LT05', 'NDVI Change 1997‑2002');

// 2003 → 2009 (Landsat‑5)
analyseDelta(2003, 2009, 'LT05', 'NDVI Change 2003‑2009');

// 2010 → 2016 (Landsat‑7)
analyseDelta(2010, 2016, 'LE07', 'NDVI Change 2010‑2016');
