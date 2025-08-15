# M.S. Capstone Project — Characterizing Citizen Science Observer Engagement: Insights from the Colorado MRoS Study

This repository contains materials from my 2025 M.S. capstone project completed in the Geography & Geospatial Science Master's Degree Program at Oregon State University. The project was conducted in collaboration with the Mountain Rain or Snow (MRoS) citizen science initiative and focused on understanding the factors influencing long-term volunteer engagement in precipitation phase monitoring.

**Full Paper (PDF):** [Seeley, R. (2025). *Characterizing Citizen Science Observer Engagement: Insights from the Colorado MRoS Study*](https://ir.library.oregonstate.edu/concern/graduate_projects/3n2047496)  

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Project Summary
- **Study Area:** Colorado, USA - diverse mountainous terrain with varied elevation, climate, and precipitation phase transitions.
- **Objective:** Identify behavioral, motivational, and spatial factors influencing engagement among MRoS observers.
- **Key Methods:**
  - **Theory of Planned Behavior (TPB) Quantitative Survey:** Measured attitudes, perceived social norms, perceived behavioral control, and behavioral intentions of observers.
  - **Spatiotemporal Analysis:** Used ArcGIS Pro to map submission hotspots, calculate travel distances, and assess spatial clustering.
  - **Temporal Engagement Analysis:** Measured participation duration, submission frequency, and responsiveness to MRoS text-message reminders.
- **Core Findings:** Sustained participation over time proved to be a strong indicator of an engaged observer rather than high short-term activity. Highly active 'super-observers' often maintained contributions across the season and generally reported higher perceived relevance of their observations to the project’s mission. Both highly active and less-engaged participants showed similar attitudes toward the project in the survey and had comparable response rates to event-driven text alerts, suggesting that shared interest and baseline motivation existed across groups regardless of overall submission totals. This indicates that the peak winter months, when precipitation phase monitoring is most relevant and field conditions are most active, may represent a key opportunity to reinforce engagement and extend active involvement

- **Implications:** Citizen science programs can strengthen retention by recognizing this peak-season period early and using it to deliver targeted messaging, community engagement opportunities, and tailored feedback that sustain motivation beyond the most active months.
  
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Repository Contents
`SeeleyReillyJ2025.pdf` — Full M.S. capstone paper.

`MRoS_Capstone_R_Scripts.zip` — Zipped archive containing 15 R scripts:
- **`data_cleaning_observations_texts.R`** — Cleans and formats raw observation and text message datasets for analysis.  
- **`daily_submission_rates_texts.R`** — Calculates and visualizes daily submission rates in relation to text message reminders.  
- **`home_proxy_submission_analysis.R`** — Assesses submissions reported from home or proxy locations versus in-field reports.  
- **`likert_response_comparison_plots.R`** — Creates plots comparing Likert-scale survey responses between observer groups.  
- **`likert_statement_similarity_analysis.R`** — Analyzes similarities in responses to individual Likert-scale survey statements.  
- **`likert_tpb_significance_analysis.R`** — Tests for statistical significance in Theory of Planned Behavior (TPB) construct scores between groups.  
- **`observation_proportions_day_week.R`** — Summarizes and visualizes the proportion of observations made on each day of the week.  
- **`obs_count_distance_analysis.R`** — Examines the relationship between observer submission counts and their travel distance to sites.  
- **`response_rates_24h_reminders.R`** — Calculates response rates to text message reminders within 24 hours of sending.  
- **`ripley_L_observer_analysis.R`** — Applies Ripley’s L function to assess spatial clustering of observer locations.  
- **`submission_frequency_analysis.R`** — Evaluates submission frequency patterns across different observer groups.  
- **`tpb_construct_response_plots.R`** — Generates visualizations of TPB construct scores by observer group.  
- **`tpb_construct_utest_violin_plot.R`** — Produces violin plots and Mann-Whitney U test results for TPB constructs.  
- **`weekly_response_summary.R`** — Summarizes weekly response activity to MRoS event reminders.  
- **`weekly_total_submissions_filtered.R`** — Calculates and visualizes weekly totals of filtered observation data.  

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Usage Notes
- **R Environment:** Scripts were developed and tested in R 4.3+ with the following core packages:
  - `tidyverse`
  - `sf`
  - `spatstat`
  - `ggplot2`
  - `dplyr`
  - `lubridate`
- **Data Access:** Raw survey and observational datasets were provided by the MRoS project and are not publicly distributed in this repository. To replicate results, you will need to supply your own equivalent data in the expected formats.
- **Running the Analysis:**
  1. Download and unzip `MRoS_Capstone_R_Scripts.zip`.
  2. Review `Script_Overview.txt` inside the archive for script purposes and run order.
  3. Open scripts in RStudio and adjust any file path variables to your local directory.
  4. Execute scripts in sequence to reproduce tables, figures, and statistical outputs.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Citation
If referencing this work, please cite the full project report:

> Seeley, R. (2025). *Characterizing Citizen Science Observer Engagement: Insights from the Colorado MRoS Study*. Master’s Capstone Project, Oregon State University. Available at: [https://ir.library.oregonstate.edu/concern/graduate_projects/3n2047496?locale=en](https://ir.library.oregonstate.edu/concern/graduate_projects/3n2047496?locale=en)
