import { webApi } from './web-api';

describe('webApi', () => {
  it('should work', () => {
    expect(webApi()).toEqual('web-api-ts');
  });
});
