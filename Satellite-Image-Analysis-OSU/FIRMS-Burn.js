/***********************************************************************
 *  B&B Complex Fire (2003) – Brightness‑Temperature & Extent Review   *
 *  ------------------------------------------------------------------ *
 *  Sensors: NASA/NOAA FIRMS Active‑Fire Archive (Brightness Temp)     *
 *  Periods Analyzed: Pre‑burn  (2000‑11‑01 → 2003‑03‑01)              *
 *                    Post‑burn (2003‑03‑01 → 2004‑03‑01)              *
 *  Metric: T21 Brightness Temperature (K)                             *
 *  Region: 14‑km buffer around Hogg Pass SNOTEL, clipped to           *
 *                HUC‑8 17090004 (upper McKenzie River, OR)            *
 *  Outputs: ▸ Pre‑fire T21 maxima (quality check)                     *
 *           ▸ Post‑fire T21 maxima as burn‑severity proxy             *
 *           ▸ Histogram + mean T21 within combined region             *
 *           ▸ % of pixels above user‑defined T21 threshold            *
 **********************************************************************/

/*************************  REGION & MAP SET‑UP ***********************/

// HUC‑8 watershed 17090004 (McKenzie River)
var huc8 = ee.FeatureCollection('USGS/WBD/2017/HUC08')
              .filter(ee.Filter.eq('huc8', '17090004'));
Map.addLayer(huc8, {}, 'HUC‑8 watershed');

// Hogg Pass SNOTEL 
var snotel = ee.Geometry.Point([-121.85, 44.4167]);
Map.addLayer(snotel, {color: 'red'}, 'Hogg Pass SNOTEL');

// McKenzie River gauge (context only)
var gauge = ee.Geometry.Point([-121.99389, 44.35139]);
Map.addLayer(gauge, {color: 'yellow'}, 'McKenzie gauge');
Map.centerObject(gauge, 10);

// 14‑km buffer of SNOTEL clipped to watershed (analysis region)
var region = snotel.buffer(14000).intersection(huc8);

// ********************** Burn‑boundary shapefile (Collection‑specific asset) ********************** //
var burnBndy = ee.FeatureCollection('users/<user>/...burn_bndy');
var burnExtent = ee.Image().float().paint(burnBndy, 1);
Map.addLayer(burnExtent, {}, 'B&B Complex extent');

/*********************  FIRMS DATA (PRE‑BURN CHECK) *********************/
var preBurn = ee.ImageCollection('FIRMS')
                .filterDate('2000-11-01', '2003-03-01')   // earliest → ignition
                .filterBounds(region)
                .select('T21');

var preMax = preBurn.max().clip(region);
var btViz  = {min: 325, max: 400, palette: ['red', 'white', 'blue']};
Map.addLayer(preMax, btViz, 'Pre-burn T21 max');


/***********************  POST‑BURN SEVERITY  ****************************/
var postBurn = ee.ImageCollection('FIRMS')
                 .filterDate('2003-03-01', '2004-03-01')
                 .filterBounds(region)
                 .select('T21');

var postMax = postBurn.max().clip(region);
var btViz2  = {min: 325, max: 500, palette: ['red', 'white', 'blue']};
Map.addLayer(postMax, btViz2, 'Post-burn T21 max');


/*********************  STATS & HISTOGRAM (T21) *************************/

// Mean brightness‑temperature within region
var meanT21 = postMax.reduceRegion({
  reducer  : ee.Reducer.mean(),
  geometry : region,
  scale    : 1000,       // FIRMS ≈1 km
  bestEffort: true
}).get('T21');
print(['Mean T21 (K) within region:', meanT21]);

// Histogram
var hist = ui.Chart.image.histogram({
             image : postMax,
             region: region,
             scale : 1000,
             maxBuckets: 30
           }).setOptions({
             title: 'Post‑burn Brightness‑Temperature Histogram',
             hAxis: {title: 'Brightness Temperature (K)'},
             vAxis: {title: 'Frequency'}
           });
print(hist);


/********************** THRESHOLD‑BASED EXTENT  *************************/
var THRESH_K = 300;            // user‑defined threshold (K)

// Mask pixels hotter than threshold
var hotMask = postMax.gt(THRESH_K);
Map.addLayer(hotMask, {palette: '00FF00'}, 'T21 > ' + THRESH_K + ' K');

// Pixel count above threshold
var hotCount = hotMask.reduceRegion({
  reducer  : ee.Reducer.sum(),
  geometry : region,
  scale    : 1000
}).get('T21');

// Area‑normalised percentage (pixels ≈ 1 km²)
var totalAreaKm2 = region.area().divide(1e6);
var percentHot   = ee.Number(hotCount).divide(totalAreaKm2).multiply(100);
print(['Pixels hotter than ' + THRESH_K + ' K (% of region):', percentHot]);
