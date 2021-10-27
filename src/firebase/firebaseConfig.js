import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAwsNKJt4pbKm7KYCpYoNF37Zcc0MEFH_g",
  authDomain: "u-match-ing.firebaseapp.com",
  projectId: "u-match-ing",
  storageBucket: "u-match-ing.appspot.com",
  messagingSenderId: "102244658464",
  appId: "1:102244658464:web:ebd0f523ecd6bd0f007b45",
  measurementId: "G-DS420V5SCX",
};

firebase.initializeApp(firebaseConfig);

export default firebaseConfig;
