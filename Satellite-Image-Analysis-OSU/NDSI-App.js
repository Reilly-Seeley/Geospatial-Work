/***********************************************************************
 *  Hogg Pass SNOTEL – NDSI Time‑Series & Export App                   *
 *  ------------------------------------------------------------------ *
 *  Sensors: Landsat‑5 TM  (currently C01 SR)                          *
 *  Periods: 1997‑2002   and   2003‑2009                               *
 *  Metric: Normalized‑Difference Snow Index (NDSI)                    *
 *  Region: 14‑km buffer around Hogg Pass, clipped to HUC‑8            *
 *          17090004 (upper McKenzie River, OR)                        *
 *  UI: Two linked maps + two time‑series charts + CSV buttons         *
 **********************************************************************/
 
/*************************  REGION & MAP SET‑UP  ***********************/
 
var huc8 = ee.FeatureCollection('USGS/WBD/2017/HUC08') // Edit watershed Feature Collection here
              .filter(ee.Filter.eq('huc8', '17090004'));

var snotel = ee.Geometry.Point([-121.85, 44.4167]); // Edit Snotel coordinates here
var gauge  = ee.Geometry.Point([-121.99389, 44.35139]); // Edit streamflow gauge coordinates here

var region = snotel.buffer(14000) // Edit radius here
                 .intersection(huc8);

Map.addLayer(snotel, {color:'red'},   'Hogg Pass SNOTEL'); // Edit as needed
Map.addLayer(gauge,  {color:'yellow'},'McKenzie Gauge');
Map.addLayer(huc8,   {},              'HUC‑8 watershed');
Map.addLayer(region, {},              'Buffer ∩ HUC‑8');

/*************************  HELPER FUNCTIONS  **************************/

// NDSI using Landsat‑5 C02 band names (Green SR_B2, SWIR1 SR_B5)
function addNDSI(img){
  return img.addBands(img.normalizedDifference(['SR_B2','SR_B5'])
                         .rename('NDSI'));
}

// Cloud/shadow/snow/water mask for C02 QA_PIXEL
function cloudMask(img){
  var qa = img.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1<<3).eq(0)   // cloud
               .and(qa.bitwiseAnd(1<<4).eq(0)) // cloud shadow
               .and(qa.bitwiseAnd(1<<5).eq(0)) // snow
               .and(qa.bitwiseAnd(1<<6).eq(0)); // water
  return img.updateMask(mask);
}

// Build FeatureCollection of mean NDSI per image
function fcTimeSeries(col, geom){
  return ee.FeatureCollection(col.map(function(img){
    var mean = img.reduceRegion({reducer: ee.Reducer.mean(),
                                 geometry: geom,
                                 scale: 30});
    return ee.Feature(null, mean).set({'date': img.date().format()});
  }));
}

function chartFC(fc,title){
  return ui.Chart.feature.byFeature(fc,'date',['NDSI'])
          .setChartType('LineChart')
          .setOptions({title:title,
                       hAxis:{title:'Date'},
                       vAxis:{title:'NDSI'},
                       lineWidth:1, pointSize:3});
}

/*********************  LANDSAT‑5 C02 COLLECTIONS *********************/
var ls97_02 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
                .filterBounds(region)
                .filterDate('1997-01-01','2002-12-31')
                .map(addNDSI)
                .map(cloudMask);

var ls03_09 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
                .filterBounds(region)
                .filterDate('2003-01-01','2009-12-31')
                .map(addNDSI)
                .map(cloudMask);

var ndsi97_02 = ls97_02.median().clip(region).select('NDSI');
var ndsi03_09 = ls03_09.median().clip(region).select('NDSI');

/*********************  UI MAPS & CHARTS ******************************/
var ndsiVis = {min:-1, max:1, palette:['blue','white','green']};

var mapA = ui.Map();
mapA.addLayer(ndsi97_02, ndsiVis,'NDSI 1997‑2002');
mapA.centerObject(snotel,10);

var mapB = ui.Map();
mapB.addLayer(ndsi03_09, ndsiVis,'NDSI 2003‑2009');
mapB.centerObject(snotel,10);

var ts97_02 = fcTimeSeries(ls97_02, region);
var ts03_09 = fcTimeSeries(ls03_09, region);

var chartA = chartFC(ts97_02,'NDSI Time‑Series 1997‑2002');
var chartB = chartFC(ts03_09,'NDSI Time‑Series 2003‑2009');

/*********************  EXPORT BUTTONS (CSV)  **************************/
var onid = 'USERID';   // EDIT
var export97 = ui.Button('Export 1997‑2002 CSV', function(){
  Export.table.toDrive({collection: ts97_02,
                        description: onid+'_NDSI_1997_2002',
                        folder: 'GEOG581',  // Ensure folder exists
                        fileFormat:'CSV'});
});
var export03 = ui.Button('Export 2003‑2009 CSV', function(){
  Export.table.toDrive({collection: ts03_09,
                        description: onid+'_NDSI_2003_2009',
                        folder: 'GEOG581',
                        fileFormat:'CSV'});
});

/*********************  LEGEND & LAYOUT *******************************/
function gradientLegend(){
  var mk = function(c){return ui.Label('',{backgroundColor:c,padding:'8px'});}  
  return ui.Panel([ui.Label('NDSI', {fontWeight:'bold'}), ui.Label('-1'), mk('blue'), mk('white'), mk('green'), ui.Label('1')],
                  ui.Panel.Layout.flow('horizontal'));
}

var control = ui.Panel([gradientLegend(), export97, export03],
                       ui.Panel.Layout.flow('vertical'),
                       {width:'250px'});

var app = ui.Panel([control, mapA, chartA, mapB, chartB],
                   ui.Panel.Layout.flow('vertical'),
                   {width:'100%'});

ui.root.clear();
ui.root.add(app);
