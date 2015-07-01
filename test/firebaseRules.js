import chai, {expect} from 'chai';
import targaryen from 'targaryen';
import request from 'request-promise';
chai.use(targaryen.chai);
import FirebaseTokenGenerator from 'firebase-token-generator';

var secret = process.env.FIREBASE_SECRET;
if (!secret) {
  throw new Error('process.env.FIREBASE_SECRET must be set');
}

const tokenGenerator = new FirebaseTokenGenerator(secret);
const token = tokenGenerator.createToken({
  uid: 'test:1'
}, {
  expires: Date.now() + 60,
  debug: true,
  admin: true
});

before(() => {
  targaryen.setFirebaseData({
    'userMappings': {
      'google:1': 'user_1',
      'google:2': 'user_2'
    },
    'users': {
      'user_1': {
        'gifts': {
          'gift_1': {
            'title': 'Skjerf'
          },
          'gift_2': {
            'title': 'Bil'
          }
        },
        'userMappings': {
          'google': 'google:1'
        }
      },
      'user_2': {
        'gifts': {
          'gift_3': {
            'title': 'Motorsykkel'
          },
          'gift_4': {
            'title': 'PC'
          }
        },
        'userMappings': {
          'google': 'google:2'
        }
      }
    }
  });

  return request('https://intense-heat-531.firebaseio.com/.settings/rules.json?auth=' + token)
    .then(JSON.parse)
    .then(targaryen.setFirebaseRules);
});

describe('Firebase Security Rules', () => {
  it('should deny unauthorized access', () => {
    expect(targaryen.users.unauthenticated).cannot.read.path('users/user_1/gifts/gift_1/title');
  });
  it('should allow an authenticated login to create a user', () => {
    expect(targaryen.users.google).can.write.to.path('users/user_1');
  });
  it('should not allow users to write to other users', () => {
    expect({uid: 'google:2'}).cannot.write.to.path('users/user_1');
  });
});
