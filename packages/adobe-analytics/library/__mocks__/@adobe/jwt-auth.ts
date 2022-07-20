import mockAuthToken from '../../__specs__/auth-token';

export default jest.fn(async () => {
  return mockAuthToken;
});
