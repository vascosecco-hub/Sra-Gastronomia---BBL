import { supabase } from './supabaseClient';
// export const AI_WEBHOOK_URL = '...'; // Not needed anymore in frontend

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/67qr218awbi70b229ooes7o6y23frq0j';

export const aiService = {
    async sendOrderToAI(orderData: any, messageSummary: string) {
        try {
            console.log('Sending order to Make.com webhook...', { orderData, messageSummary });

            const payload = {
                ...orderData,
                message_summary: messageSummary,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Webhook Error: ${response.status} - ${errorText}`);
                throw new Error(`Make.com error: ${response.statusText}`);
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text };
            }

            console.log('Webhook response:', data);
            return data;

        } catch (error) {
            console.error('Error sending order to AI:', error);
            alert(`Falha ao enviar pedido para IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}.`);
            throw error;
        }
    }
};
