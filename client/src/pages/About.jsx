import { useSelector } from "react-redux"
const About = () => {
  const {currentUser} = useSelector((state)=>state.user)

  return (
    <div>
      <h1 className="text-center mt-8 font-bold">Welcome {currentUser.username} to the About page!!</h1>
      
    </div>
  )
}

export default About