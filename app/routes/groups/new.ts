import { ActionFunction } from 'custom.env';
import { redirect } from 'remix';
import { Frequency } from '~/types.server';

export const action: ActionFunction = async ({ request: req, context }) => {
    const { id: userId } = await context.auth.isAuthenticated(req, { failureRedirect: '/login' });

    const body = await req.formData();
    const freq = body.get('freq')?.toString();

    if (!freq) {
        throw new Response('Did not get "freq".', {
            status: 400,
        });
    }

    if (!assertFreq(freq)) {
        throw new Response(`The value of "freq" (${freq}) doesn't seem right.`, {
            status: 400,
        });
    }

    try {
        await context.model.createGroup(freq, userId);
    } catch (err) {
        console.error(err);
        throw new Response('An error occurred when creating a new group', {
            status: 500,
        });
    }

    return redirect('/');
};

const FREQS: Array<Frequency> = ['Daily', 'Weekly', 'Monthly', 'HalfYearly', 'Yearly'];

const assertFreq = (t: string): t is Frequency => FREQS.includes(t as Frequency);
