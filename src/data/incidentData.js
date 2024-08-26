// src/data/incidentData.js

const incidentData = [
    {
      iceboard_id: '24070139',
      incident_creation_date: '07/12/2024 01:26 AM',
      main_application: 'EFTS',
      priority: 'P2',
      title: '[GBIS][EQD] Database issue on EFTS application',
      cause_description: 'DBA found a Postgre extension "pg_repack" used to restructure a table after a truncate which caused the deadlock.',
      communication: '575985236',
      impact_description: 'The item inventory cannot be updated.',
      information_on_resolution: 'PostGre DBA cleared the deadlock on the database and EQD was able to relaunch their batches.',
    },
    {
      iceboard_id: '24070152',
      incident_creation_date: '07/12/2024 05:57 PM',
      main_application: 'X-ONE',
      priority: 'P2',
      title: '[GBIS][EQD] X-one Equity database issues',
      cause_description: 'Under investigation, however PostGre DBA identified only 120 MB of memory left on the server.',
      communication: '576282509',
      impact_description: 'Downstream applications were unable to send messages up to the database, which was stopping data from reaching external clients.',
      information_on_resolution: 'VM memory was resized from 8 to 16. GBTO/EQD performed an operation in DoItNow for the database to utilize the available memory, resolving the incident.',
    },
    // Add more sample data as needed
  ];
  
  export default incidentData;
  