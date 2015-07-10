import chai, {expect} from 'chai';
import targaryen from 'targaryen';
import request from 'request-promise';
chai.use(targaryen.chai);
import FirebaseTokenGenerator from 'firebase-token-generator';
import {firebaseSecret} from '../server/config';

const tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);
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

const googleUser1 = {uid: 'google:1', provider: 'google'};
const googleUser2 = {uid: 'google:2', provider: 'google'};

describe('Firebase Security Rules', () => {
  it('should allow anyone to read gifts', () => {
    expect(targaryen.users.unauthenticated).can.read.path('users/user_1/gifts/gift_1/title');
  });
  it('should allow an authenticated login to create a user', () => {
    expect(googleUser1).can.write.to.path('users/user_1');
  });
  it('should not allow users to write to other users', () => {
    expect(googleUser2).cannot.write.to.path('users/user_1');
  });
  it('should allow a user to add job with name and userId', () => {
    const shareListJob = {to: 'mail@example.com', name: 'shareList', userId: 'user_1'};
    expect(googleUser1).can.write(shareListJob).to.path('jobs/1');
  });
});
