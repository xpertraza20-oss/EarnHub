/**
 * Easypaisa B2C Disbursement Service (Mock Implementation)
 * 
 * Note: Replace this mock implementation with actual Easypaisa REST/SOAP API calls
 * once the Merchant API credentials are provided.
 */

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function processEasypaisaTransfer(
  accountNumber: string,
  amount: number,
  referenceId: string
): Promise<PaymentResult> {
  console.log(`[Easypaisa API Mock] Initiating transfer of PKR ${amount} to ${accountNumber} (Ref: ${referenceId})`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Basic validation mock
  if (accountNumber.length < 11) {
    return {
      success: false,
      error: 'Invalid Easypaisa account number format'
    };
  }

  // Simulate success
  const mockTransactionId = `EP_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  console.log(`[Easypaisa API Mock] Transfer Successful. TxID: ${mockTransactionId}`);
  
  return {
    success: true,
    transactionId: mockTransactionId
  };
}
