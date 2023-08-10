import * as crypto from 'crypto';

// md5加密
export const md5 = (str) => {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};
