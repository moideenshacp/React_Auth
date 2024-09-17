import { useSelector } from "react-redux"

const Home = () => {
  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div>
      <h1 className="text-center mt-8 font-bold">Welcome {currentUser.username} to the Home page!!</h1>
    </div>
  )
}

export default Home