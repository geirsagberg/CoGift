import sendMail from '../scripts/mail';
import sinon from 'sinon';
import Fireproof from 'fireproof';
import chai from 'chai';
import firebaseRef from '../common/firebase';

const should = chai.should();

const mail = {to: 'test@test.com', subject: 'Subject', body: 'Body'};

describe('Mail sender', () => {
  var xhr, requests;

  before(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = requests.push;
  });

  after(() => {
    xhr.restore();
  });

  it('sends mail and returns a promise', () => {
    firebaseRef.should.be.instanceOf(Fireproof);
    return sendMail(mail).should.eventually.equal(true);
  });

  it('fails if no contact with Firebase', () => {
    return sendMail(mail).should.eventually.equal('error');
  });
});
