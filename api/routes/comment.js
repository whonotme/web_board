const express = require('express');
const router = express.Router();
const supaConnect = require('../connected/supaConnect');

router.post('/list_comments', async (req,res) =>{
    try{
        const { url } = req.body;
        // หา webboard id จาก url_web
        const { data: websettingData, error:websettingError } = url ? await supaConnect
        .from('website_settings')
        .select('id, url_web')
        .eq('url_web', url)
        .single()
        : ""

        const { data: webboardData, error: webboardError } = url ? await supaConnect
        .from('webboards')
        .select('id')
        .eq('web_id', websettingData?.id)
        .single()
        : 
        await supaConnect
        .from('webboards')
        .select('id')
        .single()

        if (websettingError || webboardError || !webboardData) {
            return res.status(400).json({ error: 'Webboard not found' });
        }

        const webboardId = webboardData.id;

        // ดึง comments เฉยๆ
        const {data: comments, error, count} = url ? await supaConnect
            .from("comments")
            .select(`*, webboards (id, web_id, title)`, {count: "exact"})
            .eq('blog_id', webboardId)
            .order('created_at', { ascending: false })
            :
             await supaConnect
            .from("comments")
            .select(`*, webboards (id, web_id, title)`, {count: "exact"})
            .order('created_at', { ascending: false })

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // ดึง user id ทั้งหมด
        const userIds = comments.map(c => c.user_id).filter(Boolean);

        // ดึงข้อมูล user จาก auth.users
        let users = [];
        if (userIds.length > 0) {
            for (const id of userIds) {
                const { data, error } = await supaConnect.auth.admin.getUserById(id);
                if (!error && data) {
                    users.push(data.user);
                }
            }
        }

        // console.log(userIds)

        // map user เข้า comments
        const commentData = comments.map(c => ({
            ...c,
            user: users.find(u => u.id === c.user_id) || null
        }));

        return res.status(200).json({commentData, count})
    }catch(error){
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/insert_comments', async (req,res) =>{
    try{
        const {
            user_id,
            comment,
            reply,
            blog_id
        } = req.body;
        await supaConnect
        .from("comments")
        .insert([{
            user_id,
            comment,
            reply,
            blog_id,
            created_at: new Date(),
            updated_at: null,
            crtlcode: 0
        }])
        .select();

        res.status(200).json({ message: 'Webboard entry created' });

    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post("/list_webboard", async (req, res) => {
    try {
        const { url_web } = req.body;

        const { data: websettingData, error:websettingError } = await supaConnect
        .from('website_settings')
        .select('id, url_web')
        .eq('url_web', url_web)
        .single()

        const { data, error } = await supaConnect
        .from('webboards')
        .select("id, web_id, title")
        .eq("web_id", websettingData?.id)

        if (websettingError || error) {
            return res.status(400).json({ error: error.message });
        }

        if(data){
            res.status(200).json({ webboards: data });
        }

        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router