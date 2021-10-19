import { importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose';

export const signJWT = async () => {
  const key = await importPKCS8(JWT_KEY, 'ES256');
  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export const verifyJWT = async (jwt) => {
  try {
    const key = await importSPKI(JWT_PUB, 'ES256');
    await jwtVerify(jwt, key, {
      algorithms: ['ES256'],
    })
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
}
