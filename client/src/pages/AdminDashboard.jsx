import {PencilSquareIcon,TrashIcon,PlusCircleIcon,} from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ username: "", email: "", profilePicture: "" });
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/allUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setUpdatedUser({ username: user.username, email: user.email, profilePicture: user.profilePicture });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/deleteUser/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUser = () => {
    setNewUser({ username: "", email: "", password: "", profilePicture: "" });
    setIsAddModalOpen(true);
  };

  const handleAddUserSubmit = async () => {
    try {
      const response = await axios.post("/api/admin/addUser", newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
      setIsAddModalOpen(false);
      toast.success(response.data.message || "User added successfully!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setCurrentUser(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(file);
      setUpdatedUser((prevState) => ({
        ...prevState,
        profilePicture: imageUrl,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = updatedUser.profilePicture;
  
      if (image) {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${image.name}`);
        
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      const response = await axios.put(`/api/admin/updateUser/${currentUser._id}`, { ...updatedUser, profilePicture: imageUrl }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      fetchUsers();
      handleModalClose();
      toast.success(response.data.message || "User updated successfully!");

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">
          Admin Dashboard - Users
        </h1>
        <input
            type="text"
            placeholder="Search Users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg mr-4"
          />
        <button
          onClick={handleAddUser}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition duration-300"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
        <thead>
          <tr>
            <th className="py-3 px-6 bg-gray-100 text-left">Index</th>
            <th className="py-3 px-6 bg-gray-100 text-left">Profile Photo</th>
            <th className="py-3 px-6 bg-gray-100 text-left">Name</th>
            <th className="py-3 px-6 bg-gray-100 text-left">Email</th>
            <th className="py-3 px-6 bg-gray-100 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user, index) => (
          <tr key={user._id} className="border-b">
            <td className="py-3 px-6">{index + 1}</td>
            <td className="py-3 px-6">
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                className="h-10 w-10 rounded-full object-cover"
              />
            </td>
            <td className="py-3 px-6">{user.username}</td>
            <td className="py-3 px-6">{user.email}</td>
            <td className="py-3 px-6 text-center">
              <button
                onClick={() => handleEdit(user)}
                className="text-blue-500 hover:text-blue-700 mr-3"
              >
                <PencilSquareIcon className="h-5 w-5 inline-block" />
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5 inline-block" />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center py-4">
            No users found.
          </td>
        </tr>
      )}
    </tbody>
      </table>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <div>
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              <img
                className="h-28 w-28 cursor-pointer self-center rounded-full object-cover"
                src={updatedUser.profilePicture || currentUser.profilePicture}
                alt="profile"
                onClick={() => fileRef.current.click()}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={updatedUser.username}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, username: e.target.value })
                }
                className="border px-3 py-2 w-full rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
                className="border px-3 py-2 w-full rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
            
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="border px-3 py-2 w-full rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="border px-3 py-2 w-full rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="border px-3 py-2 w-full rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserSubmit}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
