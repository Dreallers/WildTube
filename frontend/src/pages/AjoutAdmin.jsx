import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../contexts/UserContext";

function AjoutAdmin() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState([]);

  const fetch = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        { withCredentials: true }
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Error getting user");
    }
  };

  const handleClick = async (user) => {
    if (currentUser.id === user.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (user.name === "Admin") {
      toast.error("You cannot modify the super admin's status.");
      return;
    }

    if (user !== null) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`,
          {
            ...user,
            IsAdmin: !user.IsAdmin,
          }
        );
        if (user.IsAdmin) {
          toast.success("Admin deleted");
        } else {
          toast.success("Admin added");
        }

        fetch();
      } catch (err) {
        console.error("Error updating user", err);
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="ContainerAjoutAdmin">
      <div className="NamePage">
        <h3>Add administrators</h3>
      </div>
      <div className="containerUser">
        {users.map((userItem) => (
          <button
            key={userItem.id}
            type="button"
            className={`borderUser ${userItem.IsAdmin === 1 ? "checked" : ""}`}
            onClick={() => handleClick(userItem)}
          >
            <p>{userItem.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AjoutAdmin;
