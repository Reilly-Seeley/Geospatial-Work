## SNOTEL Representativeness and Post-Fire Forecast Bias: Evaluating M4 Streamflow Predictions in the McKenzie River Basin 

This project was completed as part of GEOG 581: Satellite Image Analysis in the Geography & Geospatial Science Master's Degree Program at Oregon State University. It incorporates work completed both for the class and as a graduate research assistant to Dr. Mark Raleigh, where satellite image processing and geospatial programming within Google Earth Engine were the primary focus. The project required developing a working application in Google Earth Engine capable of exporting a file, which is included in this directory as a .js script.

This study uses the 2003 B&B Complex Fire in Oregon as a natural experiment to investigate how wildfire-altered snowpack conditions influence water supply forecasts from the USDA NRCS M4 model ( https://github.com/nrcs-nwcc/M4?tab=readme-ov-file). By combining satellite-derived burn severity metrics with M4 outputs, the analysis tests how a single, wildfire-affected SNOTEL record can bias basin-scale streamflow predictions when post-fire snow dynamics diverge from pre-fire norms.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Project Summary
Study Area - McKenzie River subbasin, Oregon (Hogg Pass SNOTEL site burned in 2003 B&B Complex Fire).
Objective - Evaluate the representativeness of a burned SNOTEL SWE record for M4 model forecasts.
Methods:  
  1. NDVI Change - Quantifies pre-/post-fire vegetation differences using Landsat imagery.
  2. FIRMS Burn Severity - Maps MODIS active fire detections and maximum brightness temperature as a coarse burn-intensity proxy.
  3. CBI Random Forest Burn Severity - Uses a bias-corrected Landsat-based model to map high-resolution burn severity (adapted from Parks et al., 2019)   https://www.mdpi.com/2072-4292/11/14/1735 see disclaimer below.
  4. NDSI Snow Analysis - Maps snow cover extent and trends before and after fire.

Key Finding: Although the Hogg Pass site recorded a strong post-fire SWE signal, CBI results showed only ~7–10% of the buffer area burned at high severity. This mismatch caused M4 to extrapolate localized, disturbed snow conditions to the entire basin, producing biased streamflow forecasts in most years after the fire.

** Repository Contents
- `Project-Paper.pdf` - Full graduate project report, including M4 methodology and satellite analysis.
- `NDVI_Change.js` - Pre/post-fire vegetation analysis.
- `FIRMS_BurnSeverity.js` - MODIS active fire detection and thermal analysis.
- `CBI_BurnSeverity.js` - Bias-corrected CBI model application (adapted from Parks et al., 2019).
- `NDSI_SnowAnalysis.js` - Snow cover extent and time-series analysis.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Accounts, permissions, and user inputs
- You need a Google Earth Engine (GEE) account and an active Cloud project to use the .js files provided
- Replace asset paths with your own:
  - Fire perimeter (“burn boundary”) FeatureCollection path.
  - CBI model assets (if you want CBI outputs): training table (`cbi`) and water-deficit raster (`def`).  
     If you don’t have access, remove CBI bands from `bandsToExport` and run spectral indices only.
- Create the Google Drive folder used by exports (e.g., `cbi`) *and* set your export prefix (e.g. `onid`).
- Apps vs Code Editor: GEE Apps can’t start Drive exports. Run exports from the Code Editor (use the Tasks panel), or use the chart menu’s “Download data” for CSVs in the App.

## Versioning & deprecations
- Scripts use Landsat Collection-2 Level-2 (C02/T1_L2). If you switch collections, update band names.
- Cloud/quality masking uses QA_PIXEL bits (cloud, shadow, snow, water). Using `pixel_qa` (C01) will fail.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## CBI Model Attribution & Disclaimer
The `CBI_BurnSeverity.js` script is adapted from the Composite Burn Index Random Forest model described in Parks et al., 2019 (https://www.mdpi.com/2072-4292/11/14/1735) 
and the original GEE script (https://code.earthengine.google.com/b4fb68fb7f8f883595dbe165ff82e0d9).  
Modifications include updated date ranges, a bias-correction factor, revised Landsat collection references, and clipping to the specific ROI used in this study.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## M4 Model Reference
The USDA NRCS M4 machine-learning metasystem is available at:  
https://github.com/nrcs-nwcc/M4

See the M4 repository and user manual for build/forecast instructions, parameter settings, and predictor requirements.

Disclaimer - Running NRCS-M4 on Modern R Studio (August, 2025):
The public M4 prototype was written against ~2018-era R (3.4) and companion libraries. Re-building and forecasting in a current version of R (≥ 4.3) required re-tuning the run-control file so that every model’s predictor specification matched the PCs and raw variables that were retained during the "BUILD" phase. Newer versions of stats, qrnn, monmlp, randomForest, and e1071 seem to be stricter about scoping: they look only at the data frame you hand to predict() and throw errors such “object 'PC2' not found” or “t(E_PCR) %% datmat_PCR : non-conformable arguments” whenever a required column is missing or the matrix dimensions don’t line up. After training the model with the input data using the “BUILD” specification of the run-control file, inspect the fitted objects (e.g. attr(terms(PCRmodel),"term.labels") for the regression models or length(attr(PCANNmodel,"x.center")) for the neural networks) to see how many (and which) PCs were kept. Then, the forecast section of run-control.txt (PCSelection_Frwrd_* and VariableSelection_Frwrd_*) can be updated from the default 1 to 1,2 (or 1,2,3, etc.) as needed. R Studio and the "FORECAST" step can now be re-run in a clean working directory so that the recalculated score matrices line up with the stored eigenvectors.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Last reviewed August 2025
