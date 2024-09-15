import { Link } from "react-router-dom"

const SignUp = () => {
  return (
    <div className="p-4 max-w-lg mx-auto">
    <h1 className="text-3xl text-center font-semibold my-7 uppercase">Sign Up</h1>
    <form className="flex flex-col gap-4">
      <input type="text" placeholder="Username" id="username" className="bg-slate-100 p-3 rounded-lg" />
      <input type="email" placeholder="Email" id="email" className="bg-slate-100 p-3 rounded-lg" />
      <input type="password" placeholder="Password" id="password" className="bg-slate-100 p-3 rounded-lg" />
      <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Sign up</button>
    </form>
    <div className="mt-5">
      <p>Have an account?  <Link to='/sign-in' ><span className="text-blue-500">SignIn</span></Link></p>
    </div>
    </div>
  )
}

export default SignUp