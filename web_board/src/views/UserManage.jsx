import React from "react";
import DataTable from "./components/DataTable";
import SlideModal from './components/Modal';
import axios from "axios";
import { 
    GoPlusCircle,
    GoTrash,
    GoPencil,
} from "react-icons/go";

const API_URL = import.meta.env.VITE_API_URL;

function UserManage(){
    const [getUser, setGetUser] = React.useState(null);

    React.useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const response = await axios.get(API_URL+'/users/list_user_admin');
            // console.log(response.data);
            setGetUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // const getStatusClass = (status) => {
    //     switch (status) {
    //     case "Completed":
    //         return "status completed";
    //     case "Pending":
    //         return "status pending";
    //     case "Canceled":
    //         return "status canceled";
    //     default:
    //         return "status";
    //     }
    // };

    const [openModal, setOpenModal] = React.useState(false);
    const [addData, setAddData] = React.useState({
        email: '',
        password: '',
        display_name: '',
        role: '',
        forWebsites: '',
        nickname: ''
    });

    function onAddClose(){
        setOpenModal(false);
        setAddData({
            email: '',
            password: '',
            display_name: '',
            role: '',
            forWebsites: '',
            nickname:''
        });
    }

    async function onAddSubmit(e){
        e.preventDefault();
        try {
            const response = await axios.post(API_URL+'/users/insert_user_admin', addData);
            console.log('New user/admin added:', response.data);
            // Refresh the user list after adding a new user/admin
            fetchUserData();
        } catch (error) {
            console.error('Error adding new user/admin:', error);
        }
        setOpenModal(false);
    }

    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editData, setEditData] = React.useState(null);

    function onEditClose(){
        setIsEditOpen(false);
        setEditData(null);
    }

    function onEditOpen(val){
        setIsEditOpen(true);
        setEditData(val);
        // console.log(val);
    }
    function onEditChange(e){
        const { name, value } = e.target;

        if(name === 'display_name' || name === 'role' || name === 'forWebsites' || name === 'nickname'){
            setEditData({
                ...editData,
                user_metadata: {
                    ...editData.user_metadata,
                    [name]: value
                }
            });
        }else{
            setEditData({
                ...editData,
                [name]: value
            });
        }
    }

    async function onEditSubmit(e){
        e.preventDefault();
        try{
            const response = await axios.post(API_URL+'/users/update_user_admin', editData);

            if(response.status === 200){
                alert('Admin updated successfully');
                fetchUserData();
                setIsEditOpen(false);
                setEditData(null);
            }
            
        }catch(err){
            console.error('Error updating user/admin:', err);
        }
    }

    return(
        <>
        <div className='useradmin-container'>
            <h4 className='mb-15'>User & Admin Manager</h4>
            <p>This is the User & Admin Manager</p>
            {/* Add more content as needed */}
            <div className="useradmin-card">
                {/* You can add a table or list to show users/admins */}
                <DataTable 
                    columns={[
                        // { header: "ID", accessor: "id", cell: (row) => `${row.id}` },
                        { header: "Email", accessor: "email", cell: (row) => `${row.email}` },
                        { header: "Name", accessor: "display_name", cell: (row) => `${row?.user_metadata?.display_name || ""}` },
                        { header: "Created_at", accessor: "created_at", cell: (row) => `${new Date(row.created_at).toLocaleDateString('th', {day:'2-digit', month:'short', year:'2-digit'})}` },
                        { header: "Role", accessor: "role", cell: (row) => `${row?.user_metadata?.role || ""}` },
                        { herder: "Action", accessor: "action", cell: (row) => (
                            <div className='flex'>
                                <button className="btn btn-sm btn-secondary mr-10" onClick={() => {onEditOpen(row);}}>
                                    <GoPencil/>
                                </button>
                                <button className="btn btn-sm btn-danger mr-10">
                                    <GoTrash/>
                                </button>
                            </div>
                        ) },
                    ]}
                    data={getUser?.users || []}
                    title="User & Admin Management"
                    count={getUser?.count || 0}
                    actionButton={
                        <>
                        <button className='btn btn-primary mr-10' onClick={() => setOpenModal(true)}>
                            <GoPlusCircle className='mr-10'/> Add New
                        </button>
                        </>
                    }
                />
            </div>
        </div>
        <SlideModal 
        isOpen={openModal} 
        onClose={() => onAddClose()} 
        title="Add New Web Board"
        >
            <form onSubmit={onAddSubmit} className='p-15'>
                <div className="form-group">
                    <label>Email : </label>
                    <input 
                    type="email" 
                    name="name" 
                    className="form-control" 
                    placeholder="Enter your email" 
                    value={addData.email}
                    onChange={(e) => setAddData({...addData, email: e.target.value})}
                    required
                    />
                </div>
                <div className="row">
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Name : </label>
                            <input 
                            type="text" 
                            name="name" 
                            className="form-control" 
                            value={addData.display_name}
                            onChange={(e) => setAddData({...addData, display_name: e.target.value})}
                            placeholder="Enter your name"
                            />
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Password : </label>
                            <input 
                            type="text" 
                            name="name" 
                            className="form-control" 
                            value={addData.password}
                            onChange={(e) => setAddData({...addData, password: e.target.value})}
                            placeholder="Enter your password"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Nick Name : </label>
                            <input 
                            type="text" 
                            name="name" 
                            className="form-control" 
                            value={addData.nickname}
                            onChange={(e) => setAddData({...addData, nickname: e.target.value})}
                            placeholder="Enter your name"
                            />
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Role : </label>
                            <select 
                            name="role" 
                            className="form-control"
                            value={addData.role}
                            onChange={(e) => setAddData({...addData, role: e.target.value})}
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                            {addData.role === 'admin' ? 
                            <>
                                <label>For Website Name</label>
                                <input 
                                type="text" 
                                name="name" 
                                className="form-control" 
                                placeholder="e.g.  https://xxxxx.com" 
                                value={addData.forWebsites}
                                onChange={(e) => setAddData({...addData, forWebsites: e.target.value})}
                                />
                            </>
                                
                            : null}
                        </div>
                    </div>
                </div>
                
                <div className='form-actions'>
                    <button 
                    type="submit" 
                    className='btn btn-primary'
                    >
                        Save
                    </button>
                    <button 
                    type="button" 
                    className='btn btn-secondary' 
                    onClick={() => onAddClose()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </SlideModal>

        {/* edit modal */}
        <SlideModal
        isOpen={isEditOpen}
        onClose={() => onEditClose()}
        title="Edit User/Admin"
        >
            {editData ? 
            <form className='p-15' onSubmit={onEditSubmit}>
                <div className="form-group">
                    <label>Email : </label>
                    <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="Enter your email" 
                    value={editData.email}
                    onChange={onEditChange}
                    required
                    />
                </div>
                <div className="row">
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Name : </label>
                            <input 
                            type="text" 
                            name="display_name" 
                            className="form-control" 
                            value={editData?.user_metadata?.display_name || ""}
                            onChange={onEditChange}
                            placeholder="Enter your name"
                            />
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Password : </label>
                            <input 
                            type="text" 
                            name="password" 
                            className="form-control" 
                            value={editData?.password || ""}
                            onChange={onEditChange}
                            placeholder="Enter new password (if you want to change)"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Nick Name : </label>
                            <input 
                            type="text" 
                            name="nickname" 
                            className="form-control" 
                            value={editData?.user_metadata?.nickname || ""}
                            onChange={onEditChange}
                            placeholder="Enter your name"
                            />
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <div className="form-group">
                            <label>Role : </label>
                            <select 
                            name="role" 
                            className="form-control"
                            value={editData?.user_metadata?.role || ""}
                            onChange={onEditChange}
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {editData?.user_metadata?.role === 'admin' ? 
                <div className="form-group">
                    <label>For Website Name</label>
                    <input 
                    type="text" 
                    name="forWebsites" 
                    className="form-control" 
                    placeholder="e.g.  https://xxxxx.com" 
                    value={editData?.user_metadata?.forWebsites || ""}
                    onChange={onEditChange}
                    />
                </div>
                : null}
                <div className='form-actions'>
                    <button 
                    type="submit" 
                    className='btn btn-primary'
                    >
                        Save
                    </button>
                    <button 
                    type="button" 
                    className='btn btn-secondary' 
                    onClick={() => onEditClose()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            : null}
        </SlideModal>
        </>
    )
}
export default UserManage