import React from 'react';
import DataTable from './components/DataTable';
import { 
    GoPlusCircle,
    GoTrash,
    GoPencil
} from "react-icons/go";
import SlideModal from './components/Modal';
import axios from 'axios';
import { useImageUpload } from './components/ImageBrob';

const API_URL = import.meta.env.VITE_API_URL;

function Comments(){
    const [adminData, setAdminData] = React.useState(null);
    const [webboardList, setWebboardList] = React.useState([]);
    const [commentList, setCommentList] = React.useState([]);
    const [count, setCount] = React.useState(1)

    React.useEffect(() =>{
        const auth = sessionStorage.getItem('auth')
        const parseAuth = JSON.parse(auth)
        // console.log(parseAuth)
        if(!auth){
            navigate('/')
        }
        setAdminData(parseAuth);
        getCommentList(parseAuth)
    },[])

    async function getCommentList(data){
        try{
            // console.log(data)
            const res = await axios.post(API_URL+'/comment/list_comments',{
                url: data?.user_metadata?.forWebsites
            })
            if(res.status === 200){
                // console.log(res.data)
                setCommentList(res.data.commentData)
                setCount(res.data.count)
            }
        }catch(e){
            console.log(e)
        }
    }

    // add function
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const addEditorRef = React.useRef(null);
    const [addData, setAddData] = React.useState({
        blog_id: "",
        comment: "",
        reply:[
            {
                name: "",
                text: "",
                created_at: new Date().toISOString()
            }
        ],

    })
    const { blobFileMap, addBlob, clear, compressImage } = useImageUpload();

    async function onGetWebboardList(){
        try{
            const result = await axios.post(API_URL+'/comment/list_webboard',{
                url_web: adminData?.user_metadata?.forWebsites
            })
            if(result.status === 200){
                // console.log(result.data.webboards)
                setWebboardList(result.data.webboards)
            }
        }catch(err){
            console.log(e)
        }
    }

    function onAddOpen(){
        setIsAddOpen(true)
        onGetWebboardList()
    }

    React.useEffect(() => {
        // Initialize Summernote
        if (isAddOpen) {
            if (window.$ && addEditorRef.current) {
                window.$(addEditorRef.current).summernote({
                    placeholder: "Type something...",
                    height: 150,
                    tabsize: 2,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', ['fullscreen', 'codeview', 'help']]
                    ],
                    callbacks:{
                        onImageUpload: function (files) {
                            const file = files[0];
                            const blobUrl = URL.createObjectURL(file);
                            window.$(addEditorRef.current).summernote('insertImage', blobUrl);
                            addBlob(blobUrl, file);
                        }
                    }
                });
                window.$(addEditorRef.current).summernote('code', addData.comment || '');
            }
        }
        // Cleanup Summernote on modal close
        return () => {
            if ($(addEditorRef.current).data('summernote')) {
                $(addEditorRef.current).summernote('destroy');
            }
        };
    }, [isAddOpen]);

    function onAddClose(){
        setIsAddOpen(false)
        setAddData({
            blog_id: "",
            comment: "",
            reply:[
                {
                    name: "",
                    text: "",
                    created_at: new Date().toISOString()
                }
            ],
        })
        window.$(addEditorRef.current).summernote('code', '');
    }

    function onAddChange(e){
        const {name, value} = e.target
        // console.log(name, value)
        setAddData({
            ...addData,
            [name] : value
        })
    }

    async function onAddSubmit(e){
        e.preventDefault();
        try{
            // let finalHTML = window.$(addEditorRef.current).summernote('code');
            // console.log({...addData, comment: finalHTML})
            let finalHTML = window.$(addEditorRef.current).summernote('code');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = finalHTML;
            const images = tempDiv.querySelectorAll('img');

            for (const img of Array.from(images)) {
                const src = img.getAttribute('src');
                if (src?.startsWith('blob:') && !blobFileMap.has(src)) {
                    console.warn('⚠️ blob image not found in blobFileMap:', src);
                }
            }
            // New image upload logic
            const blobImages = Array.from(images).filter((img) => {
                const src = img.getAttribute('src');
                return src?.startsWith('blob:') && blobFileMap.has(src);
            });

            if (blobImages.length > 0) {
                for (let index = 0; index < blobImages.length; index++) {
                    const img = blobImages[index];
                    const src = img.getAttribute('src');
                    const file = blobFileMap.get(src);
                    const compressedFile = await compressImage(file, 0.3);

                    const formData = new FormData();
                    formData.append('files', compressedFile);
                    formData.append('fileName', `comment-${Date.now()}-${index}.webp`);

                    // ส่งไปที่ API ของคุณ
                    const res = await fetch(API_URL + '/uploads/upload_image_comment', {
                        method: 'POST',
                        body: formData
                    });
                    const { publicUrls } = await res.json();

                    img.setAttribute('src', publicUrls);
                }
                finalHTML = tempDiv.innerHTML;
                clear();
            }
            const res = await axios.post(API_URL+'/comment/insert_comments',{
                ...addData,
                comment: finalHTML,
                user_id: adminData?.id
            })
            if(res.status === 200){
                alert("บันทึกเรียบร้อย!!")
                onAddClose()
            }
        }catch(error){
            console.log(error)
        }
    }
    ////////////////////////////////

    // reply procressing
    function onAddReply(){
        const data = {...addData};
        const replyAll = [...data.reply];
        replyAll.push({
            name: "",
            text: "",
            created_at: new Date().toISOString()
        })
        setAddData({...data, reply: replyAll})
    }

    function onReplyChange(val, child, index){
        const data = {...addData};
        const reply = [...data.reply]
        reply[index][child] = val
        setAddData({
            ...addData,
            reply: [...reply]
        })
    }

    function onRemoveReply(index){
        const data = {...addData};
        const reply = [...data.reply];
        const filterReply = reply.filter((item, i) => i !== index);
        setAddData({...data, reply: filterReply})
    }

    //////////////////////////

    // option
    function stripHtmlTags(str) {
        if (!str) return "";
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    }
    /////////////////////////

    return(
        <>
        <div className='comments-container'>
            <h4 className='mb-15'>Comments</h4>
            <p>This is the Comments page.</p>
            {/* Add more content as needed */}
            <DataTable
            columns={[
                {header: "id", accessor: "id"},
                {header: "Webboard", accessor: "webboard", cell: (row) => row?.webboards?.title},
                {header: "Comment", accessor: "comment", cell: (row) => stripHtmlTags(row?.comment).slice(0, 200)},
                {header: "Name", accessor: "Name", cell: (row) => row?.user?.user_metadata?.display_name},
                {header: "Create At", accessor: "created_at", cell: (row) => new Date(row?.created_at).toLocaleString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit'})},
                {header: "", accessor: "action", cell: (row) =>(
                    <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
                        <button 
                        className="btn btn-sm btn-danger" 
                        >
                            <GoTrash />
                        </button>
                    </div>
                )}
            ]}
            data={commentList || []}
            title="Comment & Reply Management"
            count={count || 1}
            actionButton={
                <>
                <button className='btn btn-primary mr-10' onClick={() => onAddOpen()}>
                    <GoPlusCircle className='mr-10'/> Add New
                </button>
                </>
            }
            />
        </div>

        {/* add Comment */}
        <SlideModal 
        isOpen={isAddOpen} 
        onClose={() => onAddClose()} 
        title="Add New Comments"
        >
            <form onSubmit={onAddSubmit}>
                <div className='form-group'>
                    <label>Comment for Webboard</label>
                    <select 
                    className='form-control'
                    name="blog_id"
                    value={addData?.blog_id}
                    onChange={onAddChange}
                    >
                        <option key={0} value={""}>เลือก</option>
                        {webboardList?.map((item, i) =>{
                            return(
                                <option key={i+1} value={item?.id}>{item?.title}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='form-group'>
                    <label>Comment</label>
                    <div ref={addEditorRef}></div>
                </div>
                <div style={{width: '100%'}} className='mb-20'>
                    <div className='form-group mb-10'>
                        <label>Reply</label>
                        
                        {addData?.reply.map((item, i) =>{
                            return(
                                <div key={i} style={{border: '0.5px solid gray', borderRadius: 10, padding:10}}>
                                    <div style={{width: '50%', display:'flex', alignItems:'center' }}>
                                        <label style={{width: '30%'}}>ชื่อคนตอบกลับ : </label>
                                        <input
                                        className='form-control w-10'
                                        value={item.name}
                                        onChange={(val) => onReplyChange(val.target.value, "name", i)}
                                        />
                                    </div>
                                    <textarea 
                                    name='name'
                                    className='form-control'
                                    rows={5}
                                    placeholder='ข้อความ........'
                                    value={item.text}
                                    onChange={(val) => onReplyChange(val.target.value, "text", i)}
                                    />
                                    <div style={{width: '100%', display:'flex', justifyContent:'end'}}>
                                        <button onClick={() => onRemoveReply(i)} type='button' className='btn btn-danger btn-sm'>
                                            <GoTrash />
                                        </button>
                                    </div>
                                </div>
                                
                            )
                        })}
                        <button style={{width: 200}} type='button' className='btn btn-secondary' onClick={() => onAddReply()}>
                            Add Reply
                        </button>
                    </div>
                    
                </div>
                <div style={{display:'flex', justifyContent:'end'}}>
                    <button type='submit' className='btn btn-primary'>Save</button>
                </div>
            </form>
        </SlideModal>
        {/* end */}
        </>
    )
}
export default Comments