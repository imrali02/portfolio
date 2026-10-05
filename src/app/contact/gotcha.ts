/**
 * Minimal loader for the GotCHA widget (https://gotcha.gitbook.io/docs).
 *
 * The site key is public and safe to commit. Never put the *secret* key in
 * frontend code - it is only for server-side verification.
 */
export const GOTCHA_SITE_KEY: string =
  'qL6Wk-TXHATgktLj437fW66dtO9Idiobn8S8Ln_X6lSl__ELDtuiqBiJTw-QOKn0';

const SCRIPT_URL = 'https://static.gotcha.land/api.js';
const ONLOAD_CALLBACK = '__gotchaOnLoad';

export interface GotchaRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

export interface Gotcha {
  render(
    container: HTMLElement | string,
    options: GotchaRenderOptions,
  ): number | null;
  reset(widgetId?: number): void;
  getResponse(widgetId?: number): string | null;
}

declare global {
  interface Window {
    gotcha?: Gotcha;
    [ONLOAD_CALLBACK]?: () => void;
  }
}

export function isGotchaConfigured(): boolean {
  return GOTCHA_SITE_KEY !== '';
}

let loading: Promise<Gotcha> | null = null;

/** Injects the GotCHA script once (explicit render mode) and resolves with the global API. */
export function loadGotcha(): Promise<Gotcha> {
  if (window.gotcha) {
    return Promise.resolve(window.gotcha);
  }

  loading ??= new Promise<Gotcha>((resolve, reject) => {
    window[ONLOAD_CALLBACK] = () => {
      delete window[ONLOAD_CALLBACK];
      window.gotcha
        ? resolve(window.gotcha)
        : reject(new Error('GotCHA failed to initialise'));
    };

    const script = document.createElement('script');
    script.src = `${SCRIPT_URL}?render=explicit&onload=${ONLOAD_CALLBACK}`;
    script.async = true;
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error('GotCHA script failed to load'));
    };
    document.head.appendChild(script);
  });

  return loading;
}
