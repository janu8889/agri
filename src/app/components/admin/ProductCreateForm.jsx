"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  category: "agri",
  price: "",
  year: "",
  manufacturer: "",
  model: "",
  condition: "Used",
  hours: "",
  description: "",
  loader: "",
  backhoe: "",
  cab: "",
  engineHorsepower: "",
  drive: "",
  transmissionType: "",
  stockNumber: "",
  imgs: "",
};

export default function ProductCreateForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      imgs: form.imgs
        .split(/[\n,]/)
        .map((img) => img.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "A apărut o eroare la salvare.");
        return;
      }

      setSuccess(`Produs creat cu succes. ID: ${data?.product?._id}`);
      setForm(initialForm);
    } catch {
      setError("Nu s-a putut trimite cererea către server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#1a1a1a]">Create Product</h2>
        <p className="mt-1 text-sm text-[#555]">Completează datele și salvează în MongoDB.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={["agri", "construction", "attachments"]}
        />
        <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
        <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} required />
        <Input
          label="Manufacturer"
          name="manufacturer"
          value={form.manufacturer}
          onChange={handleChange}
          required
        />
        <Input label="Model" name="model" value={form.model} onChange={handleChange} required />
        <Select
          label="Condition"
          name="condition"
          value={form.condition}
          onChange={handleChange}
          options={["Used", "New"]}
        />
        <Input label="Hours" name="hours" type="number" value={form.hours} onChange={handleChange} />
        <Input label="Loader" name="loader" value={form.loader} onChange={handleChange} />
        <Input label="Backhoe" name="backhoe" value={form.backhoe} onChange={handleChange} />
        <Input label="Cab" name="cab" value={form.cab} onChange={handleChange} />
        <Input
          label="Engine Horsepower"
          name="engineHorsepower"
          type="number"
          value={form.engineHorsepower}
          onChange={handleChange}
        />
        <Input label="Drive" name="drive" value={form.drive} onChange={handleChange} />
        <Input
          label="Transmission Type"
          name="transmissionType"
          value={form.transmissionType}
          onChange={handleChange}
        />
        <Input label="Stock Number" name="stockNumber" type="number" value={form.stockNumber} onChange={handleChange} />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-[#1a1a1a]" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none ring-0 transition focus:border-black/30"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-[#1a1a1a]" htmlFor="imgs">
          Images (URL-uri separate prin virgulă sau linie nouă)
        </label>
        <textarea
          id="imgs"
          name="imgs"
          rows={4}
          value={form.imgs}
          onChange={handleChange}
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none ring-0 transition focus:border-black/30"
        />
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      {success ? <p className="mt-4 text-sm font-medium text-green-700">{success}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-xl bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9a227] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}

function Input({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#1a1a1a]" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none ring-0 transition focus:border-black/30"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#1a1a1a]" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none ring-0 transition focus:border-black/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
