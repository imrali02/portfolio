import {
  Component,
  ElementRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  GOTCHA_SITE_KEY,
  Gotcha,
  isGotchaConfigured,
  loadGotcha,
} from './gotcha';

/**
 * URL of the Cloudflare worker in /worker that verifies the captcha token and
 * returns the contact address. Printed by `npm run deploy` in /worker.
 */
const CONTACT_API_URL: string = 'https://portfolio-contact.haidery.workers.dev';

type CaptchaStatus =
  | 'unconfigured'
  | 'loading'
  | 'ready'
  | 'verifying'
  | 'unlocked'
  | 'rejected'
  | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  private readonly zone = inject(NgZone);
  private readonly widget =
    viewChild.required<ElementRef<HTMLElement>>('widget');
  private gotcha: Gotcha | null = null;
  private widgetId: number | null = null;

  protected readonly status = signal<CaptchaStatus>(
    isGotchaConfigured() && CONTACT_API_URL !== '' ? 'loading' : 'unconfigured',
  );
  protected readonly unlocked = computed(() => this.status() === 'unlocked');

  /** Returned by the worker once the captcha token has been verified server-side. */
  protected readonly email = signal('');

  constructor() {
    afterNextRender(() => {
      if (this.status() === 'unconfigured') {
        console.warn(
          '[contact] Set GOTCHA_SITE_KEY (gotcha.ts) and CONTACT_API_URL (contact.ts)',
        );
        return;
      }
      this.renderCaptcha();
    });
  }

  private renderCaptcha(): void {
    loadGotcha()
      .then((gotcha) => {
        this.gotcha = gotcha;
        this.widgetId = gotcha.render(this.widget().nativeElement, {
          sitekey: GOTCHA_SITE_KEY,
          // Tokens are single-use and expire after ~30s, so verify immediately.
          callback: (token) => this.zone.run(() => this.verify(token)),
          'error-callback': () => this.zone.run(() => this.status.set('error')),
        });
        this.zone.run(() => this.status.set('ready'));
      })
      .catch((err) => {
        console.error('[contact]', err);
        this.zone.run(() => this.status.set('error'));
      });
  }

  private async verify(token: string): Promise<void> {
    this.status.set('verifying');

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as {
        email?: string;
      } | null;

      if (res.ok && data?.email) {
        this.email.set(data.email);
        this.status.set('unlocked');
        return;
      }
      console.warn('[contact] verification rejected', res.status, data);
    } catch (err) {
      console.error('[contact] verification request failed', err);
    }

    // Let the visitor try again with a fresh challenge.
    this.status.set('rejected');
    this.gotcha?.reset(this.widgetId ?? undefined);
  }

  protected send(event: Event, subject: string, message: string): void {
    event.preventDefault();
    if (!this.unlocked()) return;

    const params = new URLSearchParams({
      subject: subject.trim(),
      body: message.trim(),
    });
    // URLSearchParams encodes spaces as '+', which mail clients don't decode.
    window.location.href = `mailto:${this.email()}?${params.toString().replace(/\+/g, '%20')}`;
  }
}
