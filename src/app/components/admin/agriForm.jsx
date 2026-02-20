"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  category: "agri",
  price: 0,
  year: new Date().getFullYear(),
  manufacturer: "",
  model: "",
  condition: "Used",
  hours: 0,
  description: "",
  loader: "",
  backhoe: "",
  cab: "",
  engineHorsepower: 0,
  drive: "",
  transmissionType: "",
  stockNumber: 0,
  imgs: [],
};

export default function ProductForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const numericFields = ["price", "year", "hours", "engineHorsepower", "stockNumber"];

    if (name === "imgs") {
      setForm((prev) => ({
        ...prev,
        imgs: Array.from(files),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: numericFields.includes(name) ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      // Adăugăm toate câmpurile normale
      Object.keys(form).forEach((key) => {
        if (key !== "imgs") {
          formData.append(key, form[key]);
        }
      });

      // Adăugăm imaginile (multiple)
      if (form.imgs.length > 0) {
        form.imgs.forEach((file) => {
          formData.append("imgs", file);
        });
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData, // ⚠️ fără headers JSON
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "A apărut o eroare la salvare.");
        return;
      }

      setSuccess(`Produs creat cu succes. ID: ${data?.product?._id}`);
      setForm(initialForm);
    } catch (err) {
      setError("Nu s-a putut trimite cererea către server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Create Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Select label="Category" name="category" value={form.category} onChange={handleChange} options={["agri", "construction", "attachments"]} />
        <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
        <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} />
        <Input label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
        <Input label="Model" name="model" value={form.model} onChange={handleChange} />
        <Select label="Condition" name="condition" value={form.condition} onChange={handleChange} options={["Used", "New"]} />
        <Input label="Hours" name="hours" type="number" value={form.hours} onChange={handleChange} />
        <Input label="Loader" name="loader" value={form.loader} onChange={handleChange} />
        <Input label="Backhoe" name="backhoe" value={form.backhoe} onChange={handleChange} />
        <Input label="Cab" name="cab" value={form.cab} onChange={handleChange} />
        <Input label="Engine Horsepower" name="engineHorsepower" type="number" value={form.engineHorsepower} onChange={handleChange} />
        <Input label="Drive" name="drive" value={form.drive} onChange={handleChange} />
        <Input label="Transmission Type" name="transmissionType" value={form.transmissionType} onChange={handleChange} />
        <Input label="Stock Number" name="stockNumber" type="number" value={form.stockNumber} onChange={handleChange} />
      </div>

      <div className="mt-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-black/30 outline-none transition"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1 text-sm font-medium">Upload Images</label>
        <input
          type="file"
          name="imgs"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && <p className="mt-4 text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full md:w-auto rounded-xl bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c9a227] hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}

function Input({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-black/30 outline-none transition"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:border-black/30 outline-none transition"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}