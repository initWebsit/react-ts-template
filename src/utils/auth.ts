import {tokenKey, userKey} from 'const/keys';

/**
 * Token
 * @returns {*}
 */
export function getToken(): string | null {
  return window.sessionStorage.getItem(tokenKey);
}

export function setToken(token: string) {
  return window.sessionStorage.setItem(tokenKey, token);
}

export function removeToken() {
  return window.sessionStorage.removeItem(tokenKey);
}

/**
 * userInfo
 * @returns {*}
 */
export function getUserInfo(): any  {
  if (window.sessionStorage.getItem(userKey)) {
    return JSON.parse(window.sessionStorage.getItem(userKey) as string);
  } else {
    return null;
  }
}

export function setUserInfo(user: {[k in any]: any}) {
  return window.sessionStorage.setItem(userKey, JSON.stringify(user));
}

export function removeUserInfo() {
  return window.sessionStorage.removeItem(userKey);
}

/* storage存储统一封装api--适用于sessionStorage和localStorage都可用的情况下 */
export function setStorage(key: string, value: string) {
  return window.localStorage.setItem(key, value);
}

export function getStorage(key: string): string | null {
  return window.localStorage.getItem(key);
}

/* localStorage统一封装 */
export function setLocalStorage(key: string, value: string) {
  return window.localStorage.setItem(key, value);
}

export function getLocalStorage(key: string): string | null {
  return window.localStorage.getItem(key);
}