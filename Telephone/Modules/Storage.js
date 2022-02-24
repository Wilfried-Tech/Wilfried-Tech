class JStorage {
  /**
   * @constructor 
   * @param {Number} type JStorage open mode
   */
  constructor(type) {
    /**
     * @this JStorage
     * @property {Number} type the JStorage open mode
     * @memberof JStorage
     */
    Object.defineProperty(this, 'type', {
      writable: false,
      configurable: false,
      enumerable: false,
      value: type
    })
  }
  /**
   * Get data from Storage or Cookie
   * @param {string} key key of the data
   * @returns {string|null} the data to string form
   * @memberof JStorage
   */
  getItem(key) {
    if (this.type === JStorage.LOCAL) {
      return localStorage.getItem(key)
    }
    if (this.type === JStorage.COOKIE) {
      var key = key + "=";
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(key) == 0) {
          return cookie.substring(key.length, cookie.length);
        }
      }
      return null;
    }
  }
  /**
   * set data to Storage or Cookie
   * @param {string} key key of the data
   * @param {string} value the string data
   * @param {number} [expire] the expire date of data in day
   * @memberof JStorage
   */
  setItem(key, value, expire = Infinity) {
    if (this.type === JStorage.LOCAL) {
      localStorage.setItem(key, value);
    }
    if (this.type === JStorage.COOKIE) {
      const d = new Date();
      d.setTime(d.getTime() + (expire * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = key + "=" + value + ";" + expires + ";path=/";
    }
  }
  /**
   * remove data from Storage or Cookie
   * @param {string} key key of the data
   * @memberof JStorage
   */
  removeItem(key) {
    if (this.type === JStorage.LOCAL) {
      localStorage.removeItem(key)
    }
    if (this.type === JStorage.COOKIE) {
      this.setItem(key, '', 0);
    }
  }
  /**
   * delete all data from Storage or Cookie
   * @memberof JStorage
   */
  clear() {
    if (this.type === JStorage.LOCAL) {
      return localStorage.clear();
    }
    if (this.type === JStorage.COOKIE) {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var key = cookies[i].trim().split(/\=/)[0];
        this.removeItem(key.trim(), '', 0);
      }
    }
  }
  /**
   * return the name of nth key of nth data from Storage or Cookie
   * @param {number} index key of the data
   * @returns {string|null} the key name of data
   * @memberof JStorage
   */
  key(index) {
    if (this.type === JStorage.LOCAL) {
      return localStorage.key(index)
    }
    if (this.type === JStorage.COOKIE) {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        if (i === index) {
          var key = cookies[i].trim().split(/\=/)[0];
          return key
        }
      }
    }
  }
}

/**
 * open mode Local
 * @property {number} COOKIE Cookie mode
 * @memberof JStorage
 */
Object.defineProperty(JStorage, 'LOCAL', {
  writable: false,
  configurable: false,
  enumerable: false,
  value: 0
})
/**
 * open mode Cookies
 * @property {number} LOCAL Local mode
 * @memberof JStorage
 */
Object.defineProperty(JStorage, 'COOKIE', {
  writable: false,
  configurable: false,
  enumerable: false,
  value: 1
})
