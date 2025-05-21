import { useState } from "react";
import axios from "axios";
import { ImageSizeModal } from "./ImageSizeModal";

export default function AddUserForm({ role }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    hobbies: [""],
    place: "",
    gender: "",
    photo: null,
  });

  const [showModal, setShowModal] = useState(false);

  if (role !== "admin") return <p className="text-red-500">Admins only</p>;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        setShowModal(true);
        return;
      }
      setForm({ ...form, photo: file });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleHobbyChange = (index, value) => {
    const newHobbies = [...form.hobbies];
    newHobbies[index] = value;
    setForm({ ...form, hobbies: newHobbies });
  };

  const addHobbyField = () => {
    setForm({ ...form, hobbies: [...form.hobbies, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      if (key === "hobbies") {
        form.hobbies.forEach((hobby) => data.append("hobbies", hobby));
      } else if (key === "photo" && form.photo) {
        data.append("photo", form.photo);
      } else {
        data.append(key, form[key]);
      }
    }

    try {
      await axios.post("/api/userdata", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User data submitted successfully!");
    } catch (err) {
      alert("Error submitting form.");
    }
  };

  return (
    <>
      <ImageSizeModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg space-y-4"
      >
        <h2 className="text-xl font-bold">Add New User (Admin Only)</h2>

        <input
          name="name"
          required
          onChange={handleChange}
          placeholder="Full Name"
          className="input"
        />

        <input
          name="email"
          type="email"
          required
          onChange={handleChange}
          placeholder="Email"
          className="input"
        />

        <input
          name="phone1"
          required
          onChange={handleChange}
          placeholder="Primary Phone"
          className="input"
        />

        <input
          name="phone2"
          onChange={handleChange}
          placeholder="Secondary Phone (optional)"
          className="input"
        />

        <div>
          <label className="block font-semibold mb-1">Hobbies:</label>
          {form.hobbies.map((hobby, idx) => (
            <input
              key={idx}
              value={hobby}
              onChange={(e) => handleHobbyChange(idx, e.target.value)}
              className="input my-1"
              placeholder={`Hobby #${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addHobbyField}
            className="text-blue-500 mt-2"
          >
            + Add another hobby
          </button>
        </div>

        <select
          name="place"
          required
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Place</option>
          <option value="Delhi">Kerala</option>
          <option value="Mumbai">Tamil Nadu</option>
          <option value="Chennai">Delhi</option>
        </select>

        <div className="space-x-4">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              required
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
            />{" "}
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Other"
              onChange={handleChange}
            />{" "}
            Other
          </label>
        </div>

        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="input"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </>
  );
}
