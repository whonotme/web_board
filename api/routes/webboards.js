const express = require('express');
const router = express.Router();
const supaConnect = require('../connected/supaConnect');

require('dotenv').config()

// Sample route
router.post("/insert_webboard", async (req, res) => {
    try {
        
        const { 
            title,
            url_web,
            slug,
            html_content,
            banner,
            user_id,
            keyword
        } = req.body;

        const { data, error } = await supaConnect
            .from('webboards')
            .insert([{ 
                url_web,
                title, 
                html_content,
                banner,
                user_id,
                crtlcode: 0,
                slug, 
                keyword,
                created_at: new Date().toISOString(),
                updated_at: null,
            }])
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: 'Webboard entry created', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/list_websetting', async (req,res) =>{
    try{
        const { url_web } = req.body;
        const { data, error } = url_web ? 
            await supaConnect
            .from('website_settings')
            .select('*')
            .eq('url_web', url_web)
            .order('created_at', { ascending: false })
        : 
            await supaConnect
            .from('website_settings')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ website_settings: data });
    }catch(e){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.post("/list_webboard", async (req, res) => {
    try {
        const { url_web } = req.body;

        // console.log(url_web)

        const { data: websettingData, error:websettingError } = url_web ? 
        await supaConnect
        .from('website_settings')
        .select('id, url_web')
        .eq('url_web', url_web)
        .single()
        :
        ""

        const { data, error, count } = url_web ? 
        await supaConnect
        .from('webboards')
        .select(`*,website_settings(id, url_web)`,{ count: 'exact' })
        .eq("web_id", websettingData.id)
        .order('created_at', { ascending: false })
        :
        await supaConnect
        .from('webboards')
        .select(`*,website_settings(id, url_web)`,{ count: 'exact' })
        .order('created_at', { ascending: false })

        if (websettingError || error) {
            return res.status(400).json({ error: error.message });
        }

        if(data){
            return res.status(200).json({ webboards: data, count });
        }

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/delete_webboard/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supaConnect
            .from('webboards')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Webboard entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put("/update_webboard", async (req, res) => {
    try {
        // const body = req.body;
        const { 
            id,
            title,
            url_web,
            slug,
            html_content,
            banner,
            user_id,
            keyword
        } = req.body;

        const { data, error } = await supaConnect
            .from('webboards')
            .update({ 
                url_web,
                title, 
                html_content,
                banner,
                user_id,
                crtlcode: 0,
                slug, 
                keyword,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Webboard entry updated', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;