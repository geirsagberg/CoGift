import sendMail from '../scripts/mail';
import sinon from 'sinon';
import Fireproof from 'fireproof';
import chai from 'chai';
import firebaseRef from '../common/firebase';
chai.should();

const mail = {to: 'test@test.com', subject: 'Subject', body: 'Body'};

describe('Mail sender', () => {
  var xhr, requests;

  before(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = requests.push;
    // Stub firebaseRef.child('mails').push()
  });

  after(() => {
    xhr.restore();
  });

  it('sends mail and returns a promise', () => {
    sinon.stub(firebaseRef, 'child', () => {
      return { push: () => Promise.resolve(true) };
    });

    firebaseRef.should.be.instanceOf(Fireproof);

    return sendMail(mail).should.eventually.be.true;
  });
});
