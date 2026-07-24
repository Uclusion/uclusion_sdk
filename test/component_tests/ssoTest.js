import assert from 'assert';
import { SSO } from '../../src/components/sso.js';


describe('SSO', () => {
    describe('#resendVerification', () => {
        it('preserves the synthetic test marker through a resend', async () => {
            let request;
            const client = {
                doPost: (subdomain, path, capability, body) => {
                    request = { subdomain, path, capability, body };
                    return Promise.resolve({ data: { response: 'VERIFICATION_RESENT' } });
                }
            };
            const sso = new SSO(client);

            const result = await sso.resendVerification(
                'tuser+99@uclusion.com',
                '/after-verification',
                true
            );

            assert.deepStrictEqual(result, { response: 'VERIFICATION_RESENT' });
            assert.deepStrictEqual(request, {
                subdomain: 'sso',
                path: 'resendVerification',
                capability: undefined,
                body: {
                    email: 'tuser+99@uclusion.com',
                    redirect: '/after-verification',
                    test_object: true
                }
            });
        });

        it('does not mark an ordinary resend as test data', async () => {
            let body;
            const client = {
                doPost: (_subdomain, _path, _capability, requestBody) => {
                    body = requestBody;
                    return Promise.resolve({ data: {} });
                }
            };
            const sso = new SSO(client);

            await sso.resendVerification('customer@example.com');

            assert.deepStrictEqual(body, { email: 'customer@example.com' });
        });
    });
});
