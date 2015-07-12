import * as utils from '../common/utils';

describe('utils', () => {
  describe('encodeHtml', () => {
    it('should encode all <>\'"& characters', () => {
      utils.encodeHtml('<script>hackStuff()\'"&</script>')
        .should.equal('&lt;script&gt;hackStuff()&#39;&quot;&amp;&lt;/script&gt;');
    });
  });
  describe('decodeHtml', () => {
    it('should decode all <>\'"& characters', () => {
      utils.decodeHtml('&lt;script&gt;hackStuff()&#39;&quot;&amp;&lt;/script&gt;')
        .should.equal('<script>hackStuff()\'"&</script>');
    });
  });
});
