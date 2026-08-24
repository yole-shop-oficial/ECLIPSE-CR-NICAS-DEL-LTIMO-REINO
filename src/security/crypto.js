// security/crypto — AES-GCM para datos sensibles en reposo (Mega §37).
// Clave de dispositivo no exportable en IDB; nunca sale del dispositivo.

const KEY_ID = 'device-aes-gcm-key';

export class SecurityVault {
  constructor(db, subtle = crypto.subtle) { this._db = db; this._subtle = subtle; this._key = null; }

  async init() {
    const stored = await this._db.get('keystore', KEY_ID).catch(() => null);
    if (stored?.key) { this._key = stored.key; return; }
    this._key = await this._subtle.generateKey(
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    await this._db.put('keystore', { id: KEY_ID, key: this._key });
  }

  async seal(payloadObj) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(JSON.stringify(payloadObj));
    const buf = await this._subtle.encrypt({ name: 'AES-GCM', iv }, this._key, data);
    return { iv: b64(iv), data: b64(new Uint8Array(buf)) };
  }

  async open(sealed) {
    const iv = unb64(sealed.iv); const data = unb64(sealed.data);
    const buf = await this._subtle.decrypt({ name: 'AES-GCM', iv }, this._key, data);
    return JSON.parse(new TextDecoder().decode(buf));
  }
}

function b64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function unb64(str) { return Uint8Array.from(atob(str), c => c.charCodeAt(0)); }
