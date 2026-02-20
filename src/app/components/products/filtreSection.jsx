"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function FilterSection() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    manufacturer: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
    hoursMin: "",
    hoursMax: "",
    hpMin: "",
    hpMax: "",
    sort: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log("Filters:", filters);
    // logica reală de filtrare/sortare
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
      <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">
        Search & Filter Equipment
      </h2>

      {/* SEARCH */}
      <div className="flex mb-6">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search equipment..."
          className="border border-gray-300 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
        />
        <button
          onClick={handleSearch}
          className="bg-[#1a1a1a] text-white px-4 rounded-r hover:bg-[#c9a227] transition-colors"
        >
          <FaSearch />
        </button>
      </div>

      {/* FILTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[#1a1a1a]">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#c9a227]"
          >
            <option value="">All</option>
            <option value="agriculture">Agriculture</option>
            <option value="construction">Construction</option>
            <option value="attachments">Attachments</option>
          </select>
        </div>

        {/* Manufacturer */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[#1a1a1a]">Manufacturer</label>
          <select
            name="manufacturer"
            value={filters.manufacturer}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#c9a227]"
          >
            <option value="">All</option>
            <option>JOHN DEERE</option>
            <option>KUBOTA</option>
            <option>NEW HOLLAND</option>
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[#1a1a1a]">Year</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="yearMin"
              placeholder="Min"
              value={filters.yearMin}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
            <input
              type="number"
              name="yearMax"
              placeholder="Max"
              value={filters.yearMax}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[#1a1a1a]">Price</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="priceMin"
              placeholder="Min"
              value={filters.priceMin}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
            <input
              type="number"
              name="priceMax"
              placeholder="Max"
              value={filters.priceMax}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
          </div>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[#1a1a1a]">Hours</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="hoursMin"
              placeholder="Min"
              value={filters.hoursMin}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
            <input
              type="number"
              name="hoursMax"
              placeholder="Max"
              value={filters.hoursMax}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
          </div>
        </div>

        {/* HP */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[#1a1a1a]">Horse Power (HP)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="hpMin"
              placeholder="Min"
              value={filters.hpMin}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
            <input
              type="number"
              name="hpMax"
              placeholder="Max"
              value={filters.hpMax}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#c9a227]"
            />
          </div>
        </div>

      </div>

      {/* Global Apply Filters */}
      <div className="mt-6 text-right md:text-right">
        <button
          onClick={handleSearch}
          className="cursor-pointer w-full md:w-auto bg-[#c9a227] text-black font-bold px-6 py-3 rounded hover:opacity-90 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
