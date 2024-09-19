import { useEffect, useState } from "react"
import { Link,useNavigate,useLocation } from "react-router-dom"
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const location = useLocation()
  const [formData,setFormData] = useState({})
  const {loading} = useSelector((state)=>state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  
  const handleSubmit = async (e)=>{
    e.preventDefault()
    
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      
      if(data.success === false){
        dispatch(signInFailure(data))
        toast.error(data.message) 

        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error))
      
    }
    
  }

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message); 
    }
  }, [location.state]);

  const {currentUser} = useSelector((state)=>state.user)
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <ToastContainer />
    <h1 className="text-3xl text-center font-semibold my-7 uppercase">Sign in</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="email" placeholder="Email" id="email" className="bg-slate-100 p-3 rounded-lg" onChange={handleChange} />
      <input type="password" placeholder="Password" id="password" className="bg-slate-100 p-3 rounded-lg" onChange={handleChange} />
      <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading..':'Sign In'}</button>
    </form>
    <div className="mt-5">
      <p>Dont Have an account?  <Link to='/sign-up' ><span className="text-blue-500">SignUp</span></Link></p>
    </div>
    </div>
  )
}

export default SignIn