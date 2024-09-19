import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage,ref,uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { updateStart,updateSuccess,updateFailure,deleteStart,deleteFailure,deleteSuccess,signout } from "../redux/user/userSlice"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  const fileRef = useRef(null)
  const [image,setImage] = useState(undefined)
  const [imgPercent,setImgPercent] = useState(0)
  const [imgErr,setImgErr] = useState(false)
  const [formData,setFormData] = useState({})
  const dispatch = useDispatch()
  
  
  useEffect(()=>{
    if(image){
      handleFileUpload(image)
    }
    
  },[image]) 
  
  const handleFileUpload = async (image)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + "-" + encodeURIComponent(image.name);
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPercent(Math.round(progress));
      },
      () => {
        setImgErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, profilePicture: downloadURL }));
        });
      }
    );
  };

  const handleUpdate = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handleSubmit =async (e)=>{
    e.preventDefault()

    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })

      const data = await res.json()
      if(data.success=== false){
        dispatch(updateFailure(data))
        toast.error('Update failed. Please try again.')
        return
      }
      dispatch(updateSuccess(data))
      toast.success('Profile updated successfully')
      
    } catch (error) {
      dispatch(updateFailure(error))
      toast.error('Update failed. Please try again.')
    }
  }

  const handleDeleteAcc =async()=>{
    try {
      dispatch(deleteStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
            
      })
      const data = await res.json()
      if(data.success==false){
      dispatch(deleteFailure(data))
      toast.error('Account deletion failed.')
        return
      }
      dispatch(deleteSuccess(data))
      toast.success('Account deleted successfully.')
      
    } catch (error) {
      dispatch(deleteFailure(error))
      toast.error('Account deletion failed.')
      
    }
  }
  const handleSignOut = async()=>{
    try {
      await fetch('api/auth/signout')
      dispatch(signout())
      toast.success('Signed out successfully.')
      
    } catch (error) {
      console.log(error)
      toast.error('Sign out failed.')
      
    }
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />
    <img  className="h-28 w-28 cursor-pointer self-center rounded-full object-cover" src={formData.profilePicture || currentUser.profilePicture} alt="profile" onClick={()=>fileRef.current.click()} />
    <p className="text-sm self-center">
  {imgErr ? (
    <span className="text-red-700">Error on uploading image</span>
  ) : imgPercent > 0 && imgPercent < 100 ? (
    <span className="text-slate-700">{`Uploading: ${imgPercent}%`}</span>
  ) : imgPercent === 100 ? (
    <span className="text-green-700">Image uploaded successfully!!</span>
  ) : null}
</p>

    <input defaultValue={currentUser.username} className="bg-slate-100 p-3 rounded-lg" type="text" placeholder="Username" id="username" onChange={handleUpdate}  />
    <input defaultValue={currentUser.email} className="bg-slate-100 p-3 rounded-lg" type="email" placeholder="Email" id="email" onChange={handleUpdate} />
    <input  className="bg-slate-100 p-3 rounded-lg" type="password" placeholder="Password" id="password" onChange={handleUpdate} />
    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading..' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-3">
        <span onClick={handleDeleteAcc} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went wrong!!'}</p>
      <ToastContainer />
    </div>
  )
}

export default Profile