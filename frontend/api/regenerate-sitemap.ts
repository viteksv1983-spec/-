export default async function handler(req, res) {
    try {
        const VERCEL_DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL;

        if (!VERCEL_DEPLOY_HOOK_URL) {
            return res.status(500).json({ error: 'VERCEL_DEPLOY_HOOK_URL is not configured in Vercel Environment Variables.' });
        }

        const response = await fetch(VERCEL_DEPLOY_HOOK_URL, {
            method: 'POST',
        });

        if (response.ok) {
            res.status(200).json({ message: 'Redeploy triggered successfully. Sitemap will be updated.' });
        } else {
            res.status(500).json({ error: 'Failed to trigger redeploy via Vercel Hook.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
