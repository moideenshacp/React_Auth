import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const SignUp = () => {
  const [formData,setFormData] = useState({})
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const {currentUser} = useSelector((state)=>state.user)

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  
  const handleSubmit = async (e)=>{
    e.preventDefault()
    
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      console.log(data);
      
      setLoading(false)
      if(data.success === false){
        toast.error(data.message)
        return
      }
      navigate('/sign-in',{
        state:{message:"Sign up successfully,please login now!!.."}
      })
    } catch (error) {
      setLoading(false)
      console.log(error);
      
    }
    
  }
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <ToastContainer/>
    <h1 className="text-3xl text-center font-semibold my-7 uppercase">Sign Up</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" placeholder="Username" id="username" className="bg-slate-100 p-3 rounded-lg" onChange={handleChange} />
      <input type="email" placeholder="Email" id="email" className="bg-slate-100 p-3 rounded-lg" onChange={handleChange} />
      <input type="password" placeholder="Password" id="password" className="bg-slate-100 p-3 rounded-lg" onChange={handleChange} />
      <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading..':'Sign Up'}</button>
    </form>
    <div className="mt-5">
      <p>Have an account?  <Link to='/sign-in' ><span className="text-blue-500">SignIn</span></Link></p>
    </div>
    </div>
  )
}

export default SignUp