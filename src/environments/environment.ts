// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAmFFqjM54rN8LccINRm7ME8Xa726MO81M',
    authDomain: 'hour4u-uat.firebaseapp.com',
    databaseURL: 'https://hour4u-uat.firebaseio.com',
    projectId: 'hour4u-uat',
    storageBucket: 'hour4u-uat.appspot.com',
    messagingSenderId: '1057720385634',
    appId: '1:1057720385634:web:76a6341500a6403d26113b',
    measurementId: 'G-ZQJGFM8NR3'
  },
  log: true,
  environmentName: 'local',
  version: "1.0.33",
  contactSuppportNumber: "918178582667",
  apiUrl:
    // 'https://uatapi.hour4u.com/api/', // UAT Api url
    'https://api.hour4u.com/api/', // Production Api url
  imageUrl: 'https://hour4u-img-data.s3.ap-south-1.amazonaws.com/',
  UxCamAppKey: '5a343j0gz3kv00m',
  bottomTab: [
    {
      label: 'Jobs',
      url: 'jobs',
      name: 'search-outline',
      src: 'assets/inbox-alt.svg',
      class: ''
    },
    {
      label: 'Active Jobs',
      url: 'detactive',
      name: 'bicycle-outline',
      src: 'assets/imagess/groups.png',
      srcActivated: 'assets/images/groups-select.png',
      class: ''
    },
    {
      label: 'Earnings',
      url: 'earnings',
      name: 'wallet-outline',
      src: 'assets/imagess/groups.png',
      srcActivated: 'assets/images/groups-select.png',
      class: ''
    },
    {
      label: 'My Jobs',
      url: 'my-jobs',
      name: 'briefcase-outline',
      src: 'assets/images/home.png',
      srcActivated: 'assets/images/home-select.png',
      class: 'hide',
      disabled: true
    },
    {
      label: 'Profile',
      url: 'profile',
      name: 'person-outline',
      src: 'assets/person.svg',
      srcActivated: 'assets/person.svg',
      class: 'hide',
      disabled: true
    }
  ]
};
