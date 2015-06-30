import chai, {expect} from 'chai';
import targaryen from 'targaryen';
chai.use(targaryen.chai);
// import FirebaseTokenGenerator from 'firebase-token-generator';
// import Firebase from 'firebase';

// var secret = process.env.FIREBASE_SECRET;
// if (!secret) {
//   throw new Error('process.env.FIREBASE_SECRET must be set');
// }

// const tokenGenerator = new FirebaseTokenGenerator();
// const token = tokenGenerator.createToken({
//   uid: 'test:1'
// }, {
//   expires: Date.now + 60,
//   debug: true
// });

beforeEach(() => {
  targaryen.setFirebaseData({
    "userMappings": {
      "google:104306720016343733478": "-Jq_pKTwwIpsGSJi-P0X",
      "google:106938310606776451925": "-Jse8EvBVGyhb6hOX37T",
      "google:109454697630364037743": "-Jq_osRFI6JOxDVGOtUE",
      "google:118093949389173065313": "-JseHDvPMawnnwHHA5Jv"
    },
    "users": {
      "-Jq_osRFI6JOxDVGOtUE": {
        "gifts": {
          "-Jsg1gsCtvb_Ny1N45q9": {
            "title": "Julegave"
          },
          "-Jsg9fxgX6MaBfR0LH5O": {
            "title": "Bil"
          },
          "-Jsg9i1Z5SE7jUE_mW6e": {
            "title": "Sjokolade"
          },
          "-JsyafAdImT-q0YYoQOa": {
            "title": "Sykkelbukse"
          },
          "-Jt-hvNN0h7B6_k-pRqX": {
            "title": "Teli"
          }
        },
        "userMappings": {
          "google": "google:109454697630364037743"
        }
      },
      "-Jq_pKTwwIpsGSJi-P0X": {
        "gifts": {
          "-Jq_pNBY8xUVV5G2kR6-": {
            "title": "Skjera"
          },
          "-Jqacr0X07kUEuz4dprT": {
            "title": "Yiyi"
          }
        },
        "userMappings": {
          "google": "google:104306720016343733478"
        }
      },
      "-Jse8EvBVGyhb6hOX37T": {
        "gifts": {
          "-Jse8Ggj-vh91iplPb1n": {
            "title": "PORSCHE"
          }
        },
        "userMappings": {
          "google": "google:106938310606776451925"
        }
      },
      "-JseHDvPMawnnwHHA5Jv": {
        "gifts": {
          "-JseHGayUQs6zBAPjf8y": {
            "title": "iMac"
          },
          "-JseHJ24XlPFXBtJt4gn": {
            "title": "Another iMac"
          },
          "-JseHKEApQemjgsh37ZG": {
            "title": "And a third iMac"
          }
        },
        "userMappings": {
          "google": "google:118093949389173065313"
        }
      }
    }
  });
  targaryen.setFirebaseRules({
    "rules": {
      "userMappings": {
        "$loginId": {
          ".read": "auth !== null && auth.uid === $loginId",
          ".write": "auth !== null && (data.val() === null || auth.uid === $loginId)"
        }
      },
      "users": {
        "$userId": {
          ".read": "auth !== null && data.child('userMappings/' + auth.provider).val() === auth.uid",
          ".write": "auth !== null && (data.val() === null || data.child('userMappings/' + auth.provider).val() === auth.uid)"
        }
      },
      "tokens": {
        "$tokenId": {
          ".read": true,
          ".write": "auth !== null && data.val() === null && newData.val() === auth.uid"
        }
      }
    }
  });
});

describe('Firebase Security Rules', () => {
  it('should deny unauthorized access', () => {
    expect(targaryen.users.unauthenticated)
    .cannot.read.path('users/simplelogin:1');
  });
});
