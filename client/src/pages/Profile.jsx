import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage,ref,uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"

const Profile = () => {
  const {currentUser} = useSelector((state)=>state.user)
  const fileRef = useRef(null)
  const [image,setImage] = useState(undefined)
  const [imgPercent,setImgPercent] = useState(0)
  const [imgErr,setImgErr] = useState(false)
  const [formData,setFormData] = useState({})
  console.log(formData);
  
  
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
      (error) => {
        setImgErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, profilePicture: downloadURL }));
        });
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">Profile</h1>
      <form className="flex flex-col gap-4">
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

    <input defaultValue={currentUser.username} className="bg-slate-100 p-3 rounded-lg" type="text" placeholder="Username" id="username" />
    <input defaultValue={currentUser.email} className="bg-slate-100 p-3 rounded-lg" type="email" placeholder="Email" id="email" />
    <input  className="bg-slate-100 p-3 rounded-lg" type="password" placeholder="Password" id="password" />
    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile