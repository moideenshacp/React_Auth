import { useState } from "react"
import {  useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const AdminSignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSubmit =async (e)=>{
    e.preventDefault()
    try {
    dispatch(signInStart())
    const res = await fetch('/api/admin/signin',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({email,password})
    })
    const data = await res.json()
    if(data.success === false){
      dispatch(signInFailure(data))
      return
    }
    dispatch(signInSuccess(data))
    navigate('/admin/home')
    navigate(0)
    } catch (error) {
      dispatch(signInFailure(error))
      
      
    }

  }

  const {currentUser} = useSelector((state)=>state.user)
  console.log(currentUser ? currentUser.isAdmin : currentUser,"123333333");
  
  if (currentUser) {
    return <Navigate to="/admin/home" replace />;
  }
  return (
    <div className=" items-center justify-center mt-28">
    <div className="p-4 max-w-lg mx-auto">
    <h1 className="text-3xl text-center font-semibold my-7 uppercase">Sign in</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" id="email" className="bg-slate-100 p-3 rounded-lg" />
      <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" id="password" className="bg-slate-100 p-3 rounded-lg"/>
      <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Sign in</button>
    </form>
    </div>
    </div>
  )
}

export default AdminSignIn