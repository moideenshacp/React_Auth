import { useSelector } from "react-redux"

const Profile = () => {
  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">Profile</h1>
      <form className="flex flex-col gap-4">
    <img className="h-28 w-28 cursor-pointer self-center rounded-full object-cover" src={currentUser.profilePicture} alt="profile" />
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