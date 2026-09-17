import { NextRequest, NextResponse } from 'next/server';
import { ProviderManager } from '@/lib/providers/providerManager';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const postbackData = {
      provider: 'adgate',
      transactionId: searchParams.get('transaction_id') || '',
      userId: searchParams.get('user_id') || '',
      amount: parseFloat(searchParams.get('reward') || '0'),
      status: searchParams.get('status') || 'completed',
      signature: searchParams.get('signature') || '',
      rawData: Object.fromEntries(searchParams.entries())
    };

    const manager = new ProviderManager();
    const result = await manager.processPostback(postbackData);

    if (result.success) {
      return new NextResponse('OK', { status: 200 });
    } else {
      return new NextResponse(result.error || 'Error', { status: 400 });
    }

  } catch (error) {
    console.error('AdGate postback error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}