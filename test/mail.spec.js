import sendMail from '../scripts/mail';
import sinon from 'sinon';
import Fireproof from 'fireproof';
import chai from 'chai';
import firebaseRef from '../common/firebase';
chai.should();

const mail = {to: 'test@test.com', subject: 'Subject', body: 'Body'};

describe('Mail sender', () => {
  var xhr, requests, stub;

  before(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = requests.push;
    stub = sinon.stub(firebaseRef, 'child', () => {
      return { push: () => Promise.resolve(true) };
    });
  });

  after(() => {
    xhr.restore();
    stub.restore();
  });

  it('sends mail and returns a promise', () => {
    firebaseRef.should.be.instanceOf(Fireproof);
    return sendMail(mail).should.eventually.be.true;
  });

  it('fails if no contact with Firebase', () => {
    return sendMail(mail).should.eventually.equal('error');
  });
});
