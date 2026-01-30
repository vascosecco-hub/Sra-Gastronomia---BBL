// Setup type definitions for Deno
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
    // 1. CORS Headers - Allow requests from your frontend
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 2. Get the Request Body
        const { orderData, messageSummary } = await req.json()

        // 3. Get the Secret Webhook URL from Environment Variables
        const MAKE_WEBHOOK_URL = Deno.env.get('MAKE_WEBHOOK_URL');

        if (!MAKE_WEBHOOK_URL) {
            throw new Error('MAKE_WEBHOOK_URL is not set in Edge Function secrets.');
        }

        console.log(`[Process Order] Sending request to: ${MAKE_WEBHOOK_URL}`);
        console.log(`[Process Order] Payload size: ${JSON.stringify(orderData).length} bytes`);

        // 4. Forward to Make.com
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...orderData,
                message_summary: messageSummary,
                timestamp: new Date().toISOString()
            })
        })

        console.log(`[Process Order] Webhook Response Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Process Order] Webhook Error: ${response.status} - ${errorText}`);
            throw new Error(`Make.com error: ${response.statusText}`)
        }

        // 5. Return the response to the frontend
        // Try to parse JSON response from Make.com
        const text = await response.text()
        let data
        try {
            data = JSON.parse(text)
        } catch {
            data = { message: text }
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
