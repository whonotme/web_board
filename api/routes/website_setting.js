const express = require('express');
const router = express.Router();
const supaConnect = require('../connected/supaConnect');

require('dotenv').config();

router.get("/list_website_setting", async (req, res) => {
    try {
        const { data, error, count } = await supaConnect
            .from('website_settings')
            .select('*',{ count: 'exact' })
            .limit(100)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // console.log(data);

        res.status(200).json({ website_settings: data, count });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/insert_website_setting", async (req, res) => {
    try {
        
        const { 
            url_web,
            header_html,
            footer_html,
            style_cdn
        } = req.body;

        const { data, error } = await supaConnect
            .from('website_settings')
            .insert([{ 
                url_web,
                header_html,
                footer_html,
                style_cdn,
                created_at: new Date().toISOString(),
                updated_at: null,
            }])
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Website setting created', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/update_website_setting", async (req, res) => {
    try {
        
        const { 
            id,
            url_web,
            header_html,
            footer_html,
            style_cdn
        } = req.body;

        const { data, error } = await supaConnect
            .from('website_settings')
            .update({ 
                url_web,
                header_html,
                footer_html,
                style_cdn,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Website setting updated', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;