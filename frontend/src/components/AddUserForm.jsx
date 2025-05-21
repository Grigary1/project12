import React, { useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//parser for csv files
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return null;

    const headers = lines[0].split(",").map(h => h.trim());
    const expectedHeaders = [
        "firstName",
        "middleName",
        "lastName",
        "email",
        "phone1",
        "phone2",
        "hobbies",
        "place",
        "gender",
    ];

    if (headers.length !== expectedHeaders.length) return null;
    for (let i = 0; i < headers.length; i++) {
        if (headers[i] !== expectedHeaders[i]) return null;
    }

    const data = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        return {
            firstName: values[0],
            middleName: values[1],
            lastName: values[2],
            email: values[3],
            phone1: values[4],
            phone2: values[5],
            hobbies: values[6].split(";").map(h => h.trim()),
            place: values[7],
            gender: values[8],
        };
    });

    return data;
}

//validation
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

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [csvError, setCsvError] = useState(null);
    const [isCsvMode, setIsCsvMode] = useState(false);
    const [csvData, setCsvData] = useState(null);

    const onSubmit = async (data) => {
        try {
            await axios.post(`${backendUrl}/api/admin/filldata`, data);
            alert("User added successfully!");
            reset();
        } catch (err) {
            alert("Error submitting form");
        }
    };
//csv upload
    const handleCsvUpload = (e) => {
        setCsvError(null);
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const parsedData = parseCSV(text);
            if (!parsedData) {
                setCsvError(
                    "Invalid CSV format. Required headers: firstName,middleName,lastName,email,phone1,phone2,hobbies,place,gender"
                );
                return;
            }

            setCsvData(parsedData);
            setIsCsvMode(true);
            reset();
        };
        reader.onerror = () => {
            setCsvError("Failed to read the file");
        };
        reader.readAsText(file);
    };

    const handleSubmitCsvToBackend = async () => {
        if (!csvData) return;
        try {
            await axios.post(`${backendUrl}/api/admin/filldata/batch`, {
                users: csvData,
            });
            alert("CSV data submitted successfully!");
            clearCsvMode();
        } catch (err) {
            alert("Failed to submit CSV data");
        }
    };

    const clearCsvMode = () => {
        setCsvData(null);
        setIsCsvMode(false);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg space-y-6"
            noValidate
        >
            <h2 className="text-2xl font-bold text-center mb-6">Add New User</h2>

            {/* csv upload */}
            <div>
                <label htmlFor="csvUpload" className="block font-medium mb-2">
                    Upload CSV file
                </label>
                <input
                    id="csvUpload"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    disabled={isCsvMode}
                    className="border p-2 rounded-md"
                />
                {csvError && <p className="text-red-500 mt-1">{csvError}</p>}
                {csvData && (
                    <div className="mt-3 space-x-4">
                        <button
                            type="button"
                            onClick={handleSubmitCsvToBackend}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Submit CSV
                        </button>
                        <button
                            type="button"
                            onClick={clearCsvMode}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Clear CSV
                        </button>
                    </div>
                )}
            </div>

            {/* normal form */}
            <fieldset disabled={isCsvMode} className="space-y-6 opacity-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label>First Name</label>
                        <input {...register("firstName")} className="w-full px-4 py-2 border rounded-md" />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label>Middle Name</label>
                        <input {...register("middleName")} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input {...register("lastName")} className="w-full px-4 py-2 border rounded-md" />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                        <label>Email (Gmail only)</label>
                        <input {...register("email")} className="w-full px-4 py-2 border rounded-md" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label>Primary Phone</label>
                        <input {...register("phone1")} className="w-full px-4 py-2 border rounded-md" />
                        {errors.phone1 && <p className="text-red-500 text-sm">{errors.phone1.message}</p>}
                    </div>
                    <div>
                        <label>Secondary Phone</label>
                        <input {...register("phone2")} className="w-full px-4 py-2 border rounded-md" />
                        {errors.phone2 && <p className="text-red-500 text-sm">{errors.phone2.message}</p>}
                    </div>
                </div>

                <div>
                    <label>Hobbies</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <input
                                {...register(`hobbies.${index}`)}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            {index > 0 && (
                                <button type="button" onClick={() => remove(index)} className="text-red-500">
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
                        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                    >
                        Add Hobby
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label>Place</label>
                        <input {...register("place")} className="w-full px-4 py-2 border rounded-md" />
                        {errors.place && <p className="text-red-500 text-sm">{errors.place.message}</p>}
                    </div>
                    <div>
                        <label>Gender</label>
                        <select {...register("gender")} className="w-full px-4 py-2 border rounded-md" defaultValue="">
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                    </div>
                </div>
            </fieldset>

            {!isCsvMode && (
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                    >
                        {isSubmitting ? "Submitting..." : "Add User"}
                    </button>
                </div>
            )}
        </form>
    );
}