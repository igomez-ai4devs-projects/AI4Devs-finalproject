import { DomainError } from '@sport-itsm/shared-domain';
import {
  InvalidOriginChannelError,
  ORIGIN_CHANNEL_CODES,
  OriginChannel,
} from './origin-channel.vo';

describe('OriginChannel', () => {
  it.each([...ORIGIN_CHANNEL_CODES])('accepts %s', (code) => {
    expect(OriginChannel.fromCode(code).code).toBe(code);
  });

  it.each([
    ['an unlisted channel', 'sms'],
    ['a mixed-case channel', 'Portal'],
    ['the empty string', ''],
  ])('rejects %s', (_case, code) => {
    expect(() => OriginChannel.fromCode(code)).toThrow(
      InvalidOriginChannelError,
    );
  });

  it('throws an error distinguishable by type and carrying the rejected value', () => {
    expect.assertions(3);
    try {
      OriginChannel.fromCode('sms');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidOriginChannelError);
      expect(error).toBeInstanceOf(DomainError);
      expect((error as InvalidOriginChannelError).offendingValue).toBe('sms');
    }
  });

  it('compares by code', () => {
    expect(
      OriginChannel.fromCode('portal').equals(OriginChannel.fromCode('portal')),
    ).toBe(true);
    expect(
      OriginChannel.fromCode('portal').equals(
        OriginChannel.fromCode('agent_logged'),
      ),
    ).toBe(false);
  });

  it('is immutable', () => {
    const originChannel = OriginChannel.fromCode('portal');
    expect(() => {
      (originChannel as { code: string }).code = 'agent_logged';
    }).toThrow(TypeError);
    expect(originChannel.code).toBe('portal');
  });
});
