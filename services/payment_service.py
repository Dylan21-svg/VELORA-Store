import uuid
import time

class PaymentService:
    @staticmethod
    def process_payment(order, provider, phone_number=None):
        """
        Process payment with the selected provider.
        For MTN/Orange, this simulates an API call.
        For PayPal, we returns a mock approval URL (handled in frontend/route).
        """
        transaction_id = str(uuid.uuid4())
        
        if provider == 'paypal':
            # In a real app, you'd use PayPal SDK to create an Order here and get an approval_url
            # For this MVP, we simulate success immediately or redirect to a mock approval page
            return {
                'success': True,
                'reference': f'PAYPAL-{transaction_id[:8]}',
                'message': 'Redirecting to PayPal...'
            }
            
        elif provider in ['mtn', 'orange']:
            # Simulate Mobile Money API call
            if not phone_number:
                return {
                    'success': False,
                    'message': 'Phone number is required for Mobile Money'
                }
            
            # Simulate API latency
            time.sleep(1)
            
            # Simulate 10% failure rate for realism (optional, but good for testing error handling)
            # if int(transaction_id[0], 16) % 10 == 0:
            #     return {'success': False, 'message': 'Payment failed. Insufficient funds or timeout.'}
            
            currency = 'XAF'
            prefix = 'MTN' if provider == 'mtn' else 'OM'
            
            return {
                'success': True,
                'reference': f'{prefix}-{transaction_id[:8]}',
                'message': f'Payment request sent to {phone_number}. Please approve on your phone.'
            }
            
        return {'success': False, 'message': 'Invalid provider'}
