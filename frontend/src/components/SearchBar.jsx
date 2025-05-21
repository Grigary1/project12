import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [term, setTerm] = useState("");
    const [criteria, setCriteria] = useState("name");

    const handleChange = (e) => {
        const value = e.target.value;
        setTerm(value);
        onSearch(value, criteria);
    };

    const handleCriteriaChange = (e) => {
        const value = e.target.value;
        setCriteria(value);
        onSearch(term, value);
    };

    return (
        <div className="relative w-full max-w-md mb-4 ml-auto">
            <input
                type="text"
                value={term}
                onChange={handleChange}
                placeholder={`Search by ${criteria}`}
                className="w-full border rounded px-4 py-2 pr-28"
            />
            <select
                value={criteria}
                onChange={handleCriteriaChange}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-100 border px-2 py-1 rounded text-sm"
            >
                <option value="name">Name</option>
                <option value="hobby">Hobby</option>
                <option value="place">Place</option>
            </select>
        </div>
    );
}
