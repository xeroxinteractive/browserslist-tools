import { JWTAuthResponse } from '@adobe/jwt-auth';

const authToken: JWTAuthResponse = {
  token_type: 'bearer',
  access_token: '---access-token---',
  expires_in: 3600,
};

export default authToken;
