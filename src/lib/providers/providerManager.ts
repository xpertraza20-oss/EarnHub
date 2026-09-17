// Provider Manager - Unified interface for all providers
// Easy to add new providers in the future

import { BitLabsProvider } from './bitlabs';
import { AdGateProvider } from './adgate';
import { OfferToroProvider } from './offertoro';
import db from '../db';

export interface ProviderConfig {
  id: string;
  name: string;
  apiKey?: string | null;
  apiSecret?: string | null;
  commissionRate: number;
  status: string;
}

export interface PostbackData {
  provider: string;
  transactionId: string;
  userId: string;
  amount: number;
  status: string;
  signature: string;
  rawData: any;
}

export class ProviderManager {
  private providers: Map<string, any> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders() {
    // Load active providers from database
    const activeProviders = await db.provider.findMany({
      where: { status: 'active' }
    });

    for (const provider of activeProviders) {
      this.loadProvider(provider);
    }
  }

  private loadProvider(provider: ProviderConfig) {
    switch (provider.name.toLowerCase()) {
      case 'bitlabs':
        this.providers.set('bitlabs', new BitLabsProvider({
          apiKey: provider.apiKey || '',
          apiSecret: provider.apiSecret || '',
          appId: '',
          postbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/providers/bitlabs/postback`
        }));
        break;
      case 'adgate':
        this.providers.set('adgate', new AdGateProvider({
          apiKey: provider.apiKey || '',
          publisherId: '',
          postbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/providers/adgate/postback`
        }));
        break;
      case 'offertoro':
        this.providers.set('offertoro', new OfferToroProvider({
          apiKey: provider.apiKey || '',
          widgetId: '',
          postbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/providers/offertoro/postback`
        }));
        break;
    }
  }

  // Process incoming postback from any provider
  async processPostback(data: PostbackData) {
    const provider = this.providers.get(data.provider);
    
    if (!provider) {
      console.error(`Unknown provider: ${data.provider}`);
      return { success: false, error: 'Unknown provider' };
    }

    // Verify signature
    if (!provider.verifySignature(data)) {
      return { success: false, error: 'Invalid signature' };
    }

    // Assign user ID (now a string)
    const userId = data.userId;

    // Check if transaction already processed (by userId and amount)
    const existingTransaction = await db.completedTask.findFirst({
      where: { 
        userId: userId,
        rewardAmount: data.amount,
        status: 'approved'
      }
    });

    if (existingTransaction) {
      return { success: false, error: 'Transaction already processed' };
    }

    // Credit user balance

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Calculate reward (after commission)
    const providerConfig = await db.provider.findFirst({
      where: { name: data.provider }
    });
    const commissionRate = providerConfig?.commissionRate || 0.2;
    const userReward = data.amount * (1 - commissionRate);

    // Update user balance
    await db.user.update({
      where: { id: userId },
      data: {
        balance: { increment: userReward }
      }
    });

    // Log completed task
    await db.completedTask.create({
      data: {
        userId: userId,
        status: 'completed',
        rewardAmount: userReward,
        provider: data.provider,
        tx_id: data.transactionId
      }
    });

    return { 
      success: true, 
      message: 'Postback processed successfully',
      reward: userReward
    };
  }

  // Get all active providers
  async getActiveProviders() {
    return Array.from(this.providers.keys());
  }
}

export default ProviderManager;