import { useSelector } from "react-redux"

const Home = () => {
  const {currentUser} = useSelector((state)=>state.user)
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome {currentUser.username} to the Home page!!</h1>
    </div>
  )
}

export default Home