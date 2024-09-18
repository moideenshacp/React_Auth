import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signout } from "../redux/user/userSlice"

const AdminHome = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNavigate = ()=>{
    navigate('/admin/dashboard')
  }
  const handleSignOut =async ()=>{
    try {
      await fetch('/api/admin/signout')
      dispatch(signout())
      
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome to the Admin HomePage!!</h1>
      <button
        onClick={handleNavigate}
        className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Go to Dashboard
      </button>
      <br />
      <button
        onClick={handleSignOut}
        className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Sign Out
      </button>
    </div>
  )
}

export default AdminHome