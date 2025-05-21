import React from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Schema for Form Validation
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().optional(),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Must be a Gmail address"),
  phone1: yup
    .string()
    .required("Phone 1 is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  phone2: yup
    .string()
    .optional()
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  hobbies: yup.array().of(yup.string().required("Hobby is required")),
  place: yup.string().required("Place is required"),
  gender: yup.string().required("Gender is required"),
});

export default function AddUserForm({ role = "User" }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone1: "",
      phone2: "",
      hobbies: [""],
      place: "",
      gender: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const onSubmit = async (data) => {
    try {
      await axios.post(`${backendUrl}/api/admin/filldata`, {
        ...data,
      });
      alert("User added successfully!");
      reset();
    } catch (err) {
      alert("Error submitting form");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg space-y-6"
      noValidate
    >
      <h2 className="text-2xl font-bold text-center mb-6">Add New User</h2>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="firstName" className="block font-medium">
            First Name
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            placeholder="John"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="middleName" className="block font-medium">
            Middle Name (Optional)
          </label>
          <input
            id="middleName"
            {...register("middleName")}
            placeholder="Doe"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="block font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            placeholder="Smith"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email & Phones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="email" className="block font-medium">
            Gmail Address
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="phone1" className="block font-medium">
            Primary Phone
          </label>
          <input
            id="phone1"
            {...register("phone1")}
            placeholder="9876543210"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.phone1 && (
            <p className="text-red-500 text-sm">{errors.phone1.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="phone2" className="block font-medium">
            Secondary Phone (Optional)
          </label>
          <input
            id="phone2"
            {...register("phone2")}
            placeholder="9876543210"
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.phone2 && (
            <p className="text-red-500 text-sm">{errors.phone2.message}</p>
          )}
        </div>
      </div>

      {/* Hobbies */}
      <div className="space-y-2">
        <label className="block font-medium">Hobbies</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              {...register(`hobbies.${index}`, { required: true })}
              placeholder="Reading, Coding..."
              className="w-full px-4 py-2 border rounded-md"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
            {errors.hobbies?.[index] && (
              <p className="text-red-500 text-sm">
                {errors.hobbies[index]?.message || "Hobby is required"}
              </p>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append("")}
          className="text-blue-500 hover:underline"
        >
          + Add Hobby
        </button>
      </div>

      {/* Place & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="place" className="block font-medium">
            Place
          </label>
          <select
            id="place"
            {...register("place")}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Place</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
          </select>
          {errors.place && (
            <p className="text-red-500 text-sm">{errors.place.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block font-medium">Gender</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2">
              <input {...register("gender")} type="radio" value="Male" />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input {...register("gender")} type="radio" value="Female" />
              Female
            </label>
            <label className="flex items-center gap-2">
              <input {...register("gender")} type="radio" value="Other" />
              Other
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>
      </div>

      {/* Role (Admin Only) */}
      {role === "Admin" && (
        <div className="space-y-1">
          <label className="block font-medium">User Role</label>
          <select
            {...register("role")}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Add User"}
        </button>
      </div>
    </form>
  );
}
