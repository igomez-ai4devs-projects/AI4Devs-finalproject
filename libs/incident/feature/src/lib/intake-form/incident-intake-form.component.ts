import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorCode } from '@sport-itsm/shared-contracts';
import { IncidentStore } from '@sport-itsm/incident-data-access';
import { incidentDetailUrl } from '../incident-routes';
import {
  INCIDENT_MESSAGES,
  IncidentIntakeField,
  SHORT_DESCRIPTION_MAX_LENGTH,
  isIncidentIntakeField,
  messageForFieldRule,
} from '../incident-messages';
import {
  notBlankValidator,
  primaryClientRule,
} from './incident-intake-form-validation';

interface FieldError {
  readonly field: IncidentIntakeField;
  readonly message: string;
}

/**
 * Ids the template hardcodes as literals (`label for`, hint/error `id`,
 * `aria-describedby`) — kept alongside each other here so the two ends of
 * every association are easy to audit together. Change one, change both.
 */
const FIELD_HINT_ID: Record<IncidentIntakeField, string> = {
  shortDescription: 'incident-short-description-hint',
  description: 'incident-description-hint',
};
const FIELD_ERROR_ID: Record<IncidentIntakeField, string> = {
  shortDescription: 'incident-short-description-error',
  description: 'incident-description-error',
};
const FIELD_INPUT_ID: Record<IncidentIntakeField, string> = {
  shortDescription: 'incident-short-description',
  description: 'incident-description',
};

/**
 * The requester-facing intake form (`T-C1-10`, `US-C1-01`, `FR-INC-01`) — the
 * first screen of the product. Submits through `IncidentStore` (`T-C1-09`)
 * only; this component never speaks `HttpClient` directly.
 *
 * **No Impact, Urgency, Priority or competition-in-progress control anywhere
 * in this component or its template (AC1).** `LogIncidentRequesterRequest`
 * has no field for any of them — a requester describes a problem, an agent
 * assesses it later (`US-C1-01`, `US-C1-03`).
 *
 * **Competition context (`T-C1-10` Trap 1).** The Scope this ticket was
 * drawn from asks for a control naming the competition context, but the
 * requester contract carries no such field and the API's global
 * `ValidationPipe` (`forbidNonWhitelisted`) rejects any property it does not
 * whitelist. This component takes option (a) from the ticket's own two
 * choices: no separate control, only a hint on the description field asking
 * the requester to mention the match or competition if relevant
 * (`incidentDescriptionHint`). Option (b) — a separate control whose value is
 * concatenated into `description` before sending — was rejected: it would
 * merge two distinct pieces of information into one free-text field with no
 * way for a later triage agent to tell them apart again once submitted,
 * which is strictly worse than never having split them in the first place.
 * Reported as a finding for `architect-tech-lead` per the ticket's own
 * instruction.
 *
 * **No `affectedServiceId` control (`T-C1-10` Trap 1).** The contract allows
 * it, but asking a requester to supply a raw UUID is meaningless without a
 * service catalog to pick from, and none exists yet (`service-catalog`
 * epic). The field is simply not sent. Reported as a finding.
 *
 * **AC3 is pending on purpose.** The error summary below uses `role="alert"`
 * only — the `aria-live` region `T-C10-14` will add (`libs/shared/ui`'s
 * announcer primitive) is not part of this delivery slice (deviation 1 of
 * the ticket). `role="alert"` alone already gets most assistive technology to
 * announce the summary as an implicit assertive live region, but it is not
 * the same guarantee `T-C10-14` is meant to provide, and this criterion does
 * not pass until `T-C10-12`/`T-C10-13`/`T-C10-14` exist — see the ticket's own
 * "Known-pending criterion" note. Do not remove this comment when `T-C10-14`
 * lands; replace the summary's markup instead.
 */
@Component({
  selector: 'incident-intake-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-intake-form.component.html',
  styleUrl: './incident-intake-form.component.scss',
})
export class IncidentIntakeFormComponent {
  private readonly incidentStore = inject(IncidentStore);
  private readonly router = inject(Router);

  protected readonly messages = INCIDENT_MESSAGES.intakeForm;
  protected readonly shortDescriptionMaxLength = SHORT_DESCRIPTION_MAX_LENGTH;

  protected readonly form = new FormGroup({
    shortDescription: new FormControl('', {
      nonNullable: true,
      validators: [
        notBlankValidator(),
        Validators.maxLength(SHORT_DESCRIPTION_MAX_LENGTH),
      ],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [notBlankValidator()],
    }),
  });

  /**
   * Set the moment this component itself first attempts a submission. Guards
   * both the error summary (never shown before a first attempt, even if the
   * form is technically invalid on load) and the success-navigation effect
   * below — see that effect's own comment for why the latter matters.
   */
  private readonly submitAttempted = signal(false);

  private readonly errorSummaryRef =
    viewChild<ElementRef<HTMLElement>>('errorSummary');

  protected readonly submitting = computed(() =>
    this.incidentStore.intakeLoading(),
  );

  /**
   * The requester-visible field-level errors, from whichever source produced
   * them: the server's typed `400 VALIDATION_FAILED` response takes priority
   * (it is the ground truth once a request was actually sent), and this
   * form's own client-side validators are shown only when a submission was
   * attempted with no server call yet made (the ordinary "fix this before we
   * even try" path).
   */
  protected readonly errorSummaryItems = computed<FieldError[]>(() => {
    const apiError = this.incidentStore.intakeError();
    if (
      apiError?.kind === 'api-error' &&
      apiError.code === ErrorCode.VALIDATION_FAILED
    ) {
      return (apiError.details ?? [])
        .filter((detail) => isIncidentIntakeField(detail.field))
        .map((detail) => ({
          field: detail.field as IncidentIntakeField,
          message: messageForFieldRule(detail.field, detail.rule),
        }));
    }
    if (this.submitAttempted() && this.form.invalid) {
      return this.clientFieldErrors();
    }
    return [];
  });

  /**
   * A failure with nothing to attach to one of this form's two fields: a
   * network failure, a non-validation API error (`NOT_FOUND`, `INTERNAL_ERROR`,
   * an unrecognized code…), or a `VALIDATION_FAILED` response whose details
   * name no field this form renders (e.g. a future `affectedServiceId`
   * rejection). Never left silent (`NFR-USE-05`, Trap 3).
   */
  protected readonly topLevelError = computed<string | null>(() => {
    const apiError = this.incidentStore.intakeError();
    if (apiError === null) {
      return null;
    }
    if (apiError.kind === 'network-error') {
      return this.messages.networkErrorMessage;
    }
    if (apiError.code !== ErrorCode.VALIDATION_FAILED) {
      return this.messages.genericErrorMessage;
    }
    const details = apiError.details ?? [];
    const hasRenderableDetail = details.some((detail) =>
      isIncidentIntakeField(detail.field),
    );
    return details.length === 0 || !hasRenderableDetail
      ? this.messages.genericErrorMessage
      : null;
  });

  /**
   * The server's `correlationId`, shown as a support reference when present.
   * Decision (`T-C1-10` Trap 3): shown, because it is the one piece of
   * information a requester can hand to a support agent to find the exact
   * failed request in server logs, and it identifies nothing about the
   * requester themselves.
   */
  protected readonly supportCode = computed<string | null>(() => {
    const apiError = this.incidentStore.intakeError();
    return apiError?.kind === 'api-error' ? apiError.correlationId : null;
  });

  protected readonly hasErrors = computed(
    () => this.errorSummaryItems().length > 0 || this.topLevelError() !== null,
  );

  constructor() {
    // Side effect, not derived state — navigation has no value a computed()
    // could expose, so `effect()` is the right tool, not a workaround
    // (`sport-itsm-frontend`: effect() sparingly, only with a real reason).
    //
    // Gated on `submitAttempted()`, not merely on the reference becoming
    // non-null: `IncidentStore` is a `providedIn: 'root'` singleton by design
    // (its own doc comment explains why — `T-C1-101` needs to read the same
    // reference after this component navigates away). Without this guard, a
    // requester who submits successfully, is redirected, and later returns to
    // `/incidents/new` in the same browser session would be redirected again
    // the instant this component mounts, before touching the form — the
    // store's `createdIncidentReference` would still be non-null from the
    // earlier, unrelated submission. Gating on this component instance's own
    // attempt makes the effect fire only for a submission *it* made.
    effect(() => {
      const reference = this.incidentStore.createdIncidentReference();
      if (reference !== null && this.submitAttempted()) {
        this.router.navigateByUrl(incidentDetailUrl(reference));
      }
    });

    // Moves focus to the error summary the moment a submission this
    // component made settles into a server-side failure (AC2). The
    // client-side failure path (`onSubmit` below) calls the same method
    // directly, since no store state changes in that case for this effect to
    // react to.
    effect(() => {
      const apiError = this.incidentStore.intakeError();
      if (apiError !== null && this.submitAttempted()) {
        this.focusErrorSummary();
      }
    });
  }

  protected fieldError(field: IncidentIntakeField): string | null {
    return (
      this.errorSummaryItems().find((item) => item.field === field)?.message ??
      null
    );
  }

  protected hintId(field: IncidentIntakeField): string {
    return FIELD_HINT_ID[field];
  }

  protected errorId(field: IncidentIntakeField): string {
    return FIELD_ERROR_ID[field];
  }

  protected fieldInputId(field: IncidentIntakeField): string {
    return FIELD_INPUT_ID[field];
  }

  protected describedBy(field: IncidentIntakeField): string {
    return this.fieldError(field)
      ? `${FIELD_HINT_ID[field]} ${FIELD_ERROR_ID[field]}`
      : FIELD_HINT_ID[field];
  }

  protected onSubmit(): void {
    this.submitAttempted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusErrorSummary();
      return;
    }

    this.incidentStore.logIncidentAsRequester({
      shortDescription: this.form.controls.shortDescription.value.trim(),
      description: this.form.controls.description.value.trim(),
    });
  }

  private clientFieldErrors(): FieldError[] {
    const fields: readonly IncidentIntakeField[] = [
      'shortDescription',
      'description',
    ];
    return fields.reduce<FieldError[]>((items, field) => {
      const rule = primaryClientRule(this.form.controls[field].errors);
      if (rule !== null) {
        items.push({ field, message: messageForFieldRule(field, rule) });
      }
      return items;
    }, []);
  }

  private focusErrorSummary(): void {
    // Deferred to the next macrotask: the error summary is only in the DOM
    // once `hasErrors()` turns true and Angular re-renders for it, and the
    // state changes just above (`submitAttempted.set`, or the store settling
    // into an error) happen synchronously before that render runs. Focusing
    // an element that is not there yet is a silent no-op (AC2).
    setTimeout(() => this.errorSummaryRef()?.nativeElement.focus());
  }
}
