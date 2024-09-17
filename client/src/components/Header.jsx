import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

const Header = () => {

  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div className="bg-slate-200">
        <div className="flex justify-between items-center
        max-w-6xl mx-auto p-3">
            <Link to='/'>
            <h1 className="font-bold">Auth App</h1>
            </Link>
            

            <ul className="flex gap-4">
               <Link to='/'> <li>Home</li></Link>
               <Link to='/about'> <li>About</li></Link>
               <Link to='profile'>
               {currentUser ? (
                 <img className="w-10 h-7 rounded-full object-cover " src={currentUser.profilePicture} alt="Profile picture" />
                ):(
                  
                  <Link to='sign-in'> <li>Sign In</li></Link>
                )}

                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header