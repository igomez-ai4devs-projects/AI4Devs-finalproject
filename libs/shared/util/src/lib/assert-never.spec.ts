import { assertNever } from './assert-never';

type Channel = 'email' | 'portal';

function describeChannel(channel: Channel): string {
  switch (channel) {
    case 'email':
      return 'Email';
    case 'portal':
      return 'Self-Service Portal';
    default:
      return assertNever(channel);
  }
}

describe('assertNever', () => {
  it('lets an exhaustive switch compile and return every branch', () => {
    expect(describeChannel('email')).toBe('Email');
    expect(describeChannel('portal')).toBe('Self-Service Portal');
  });

  it('throws when an unmodelled member reaches it at runtime', () => {
    const fromOutsideTheTypeSystem = 'chat' as unknown as never;

    expect(() => assertNever(fromOutsideTheTypeSystem)).toThrow(
      'Unhandled union member: chat',
    );
  });

  it('rejects a union that has not been exhausted', () => {
    const notExhausted = 'portal' as Channel;

    // @ts-expect-error assertNever accepts `never` only: a union member still
    // left to handle must fail to compile. Removing a case from
    // `describeChannel` above reproduces this error in production code.
    expect(() => assertNever(notExhausted)).toThrow();
  });
});
