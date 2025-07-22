
import { NextResponse } from 'next/server';
import { updateMemorialPlanAction } from '@/lib/actions';
import https from 'https';

export async function POST(request: Request) {
  try {
    const { reference, plan, memorialId } = await request.json();

    if (!reference || !plan || !memorialId) {
      return NextResponse.json({ status: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('[API/Paystack] Paystack secret key is not configured.');
      return NextResponse.json({ status: false, message: 'Server configuration error.' }, { status: 500 });
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    };

    // Use a promise to handle the async nature of the https request
    const paystackResponse: any = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse Paystack response'));
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error(`Could not connect to payment gateway: ${e.message}`));
      });

      req.end();
    });

    if (paystackResponse.status && paystackResponse.data.status === 'success') {
      console.log('[API/Paystack] Paystack verification successful.');
      // The user ID 'PAYSTACK_SYSTEM' is a placeholder since this action is triggered by the system after payment verification.
      // The action itself should be responsible for finding the correct user based on the memorialId.
      await updateMemorialPlanAction('PAYSTACK_SYSTEM', memorialId, plan);
      return NextResponse.json({ status: true, message: 'Payment verified successfully.' });
    } else {
      console.warn('[API/Paystack] Paystack verification failed:', paystackResponse.message);
      return NextResponse.json({ status: false, message: paystackResponse.message || 'Payment verification failed.' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('[API/Paystack] An unexpected error occurred:', error);
    return NextResponse.json({ status: false, message: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
