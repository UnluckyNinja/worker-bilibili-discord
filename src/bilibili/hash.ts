import { md5 } from '../utils/md5';

const DEFAULT_KEY = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50,
  10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38,
  41, 13, 37, 48, 7, 16, 24, 55, 40, 61,
  26, 17, 0, 1, 60, 51, 30, 4, 22, 25,
  54, 21, 56, 59, 6, 63, 57, 62, 11, 36,
  20, 34, 44, 52
]

/**
 * pass in imgKey + subKey, return new key
 */
export function hashKeys(input: string, key: number[] = DEFAULT_KEY) {
  const newChars: string[] = [];
  key.forEach(substitution => {
    const char = input.charAt(substitution)
    if (char) {
      newChars.push(char)
    }
  })
  return newChars.join('').slice(0, 32)
}

export function hashQueries(requestParams: Record<string, string | undefined | null>, keys = {
  wbiImgKey: '',
  wbiSubKey: ''
}) {
  const {
    wbiImgKey: imgKey,
    wbiSubKey: subKey
  } = keys;
  if (imgKey && subKey) {
    const combinedKey = hashKeys(imgKey + subKey),
      timestamp = Math.round(Date.now() / 1000),
      params = Object.assign({
      }, requestParams, {
        wts: timestamp
      }),
      sortedKeys = Object.keys(params).sort(),
      constructedPairs = [],
      regex = /[!'()*]/g;
    for (let i = 0; i < sortedKeys.length; i++) {
      const ithKey = sortedKeys[i];
      let ithValue = params[ithKey];
      if (
        ithValue &&
        typeof ithValue == 'string'
      ) {
        ithValue = ithValue.replace(regex, '')
      }
      if (
        ithValue != null
      ) {
        constructedPairs.push(
          ''.concat(encodeURIComponent(ithKey), '=').concat(encodeURIComponent(ithValue))
        )
      }
    }
    const u = constructedPairs.join('&');
    return {
      w_rid: md5(u + combinedKey),
      wts: timestamp.toString()
    }
  }
  return null
}
