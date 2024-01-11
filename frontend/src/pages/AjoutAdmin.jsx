import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AjoutAdmin() {
  const [users, setUsers] = useState([]);

  const fetch = async () => {
    try {
      const response = await axios.get("http://localhost:3310/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error getting user");
    }
  };

  const handleClick = async (user) => {
    if (user !== null) {
      try {
        await axios.put(`http://localhost:3310/api/users/${user.id}`, {
          ...user,
          IsAdmin: !user.IsAdmin,
        });
        if (user.IsAdmin) {
          toast.success("Admin supprimé");
        } else {
          toast.success("Admin ajouté");
        }

        fetch();
      } catch (e) {
        console.error("Error updating user", e);
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="ContainerAjoutAdmin">
      <div className="NamePage">
        <h3>Ajouter des Administrateurs</h3>
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