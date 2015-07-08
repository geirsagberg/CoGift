const firebaseSecret = process.env.COGIFT_FIREBASE_SECRET;
if(!firebaseSecret){
  throw new Error('process.env.COGIFT_FIREBASE_SECRET is missing!');
}

export default {
  firebaseUrl: process.env.COGIFT_FIREBASE_URL || 'https://intense-heat-531.firebaseio.com',
  firebaseSecret,
  serverUrl: process.env.COGIFT_SERVER_URL || 'http://localhost:3000'
};
