"use client";
import { useEffect, useState } from "react";

export interface IncomeVM {
  _id?: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
  userId: string;
}

export const Income = () => {
  const [incomes, setIncomes] = useState<IncomeVM[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [updateIncome, setUpdateIncome] = useState<IncomeVM | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [otherSource, setOtherSource] = useState<string>("");

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    date: "",
  });

  const BASE_URL = "http://localhost:5002/api";

  const incomeSources = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Bonus",
    "Other",
  ];

  useEffect(() => {
    const id = localStorage.getItem("id");

    if (!id) {
      setMessage("No user logged in");
      return;
    }

    setUserId(id);
    fetchIncomes(id, filterSource, sortOption);
  }, [filterSource, sortOption]);

  const fetchIncomes = async (id: string, source = "", sort = "") => {
    try {
      // Fetch incomes
      const incomeResponse = await fetch(`${BASE_URL}/income/user/${id}`);
      let incomeData: IncomeVM[] = await incomeResponse.json();
      console.log(incomeData);

      // Filter by source
      if (source) {
        if (source === "Other") {
          incomeData = incomeData.filter((income) => !incomeSources.includes(income.source));
        } else {
          incomeData = incomeData.filter((income) => income.source === source);
        }
      }

      //Sort
      if (sort === "amountAsc") incomeData.sort((a, b) => a.amount - b.amount);
      if (sort === "amountDesc") incomeData.sort((a, b) => b.amount - a.amount);
      if (sort === "dateAsc")
        incomeData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (sort === "dateDesc")incomeData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Update state
      setIncomes(incomeData);
      setTotalIncome(incomeData.reduce((sum, currentIncome) => sum + currentIncome.amount, 0));
      setMessage(incomeData.length === 0 ? "No incomes found for selected source." : null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch incomes");
    }
  };

  // --- VALIDATIONS ---
  const validateAmount = (amount: number) => {
    if (isNaN(amount) || amount <= 0) return "Amount must be greater than 0";
    if (amount > 1000000) return "Amount cannot exceed 1,000,000";
    return null;
  };

  const validateDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (isNaN(date.getTime())) return "Invalid date";
    if (date > today) return "Date cannot be in the future";
    if (date.getFullYear() < 1900) return "Date cannot be before 1900";
    return null;
  };

  const normalizeDate = (dateStr: string) =>
    new Date(dateStr).toISOString().slice(0, 10);

  // --- FORM HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setMessage("Amount must be a valid number");
      return;
    }

    const amountError = validateAmount(amount);
    if (amountError) {
      setMessage(amountError);
      return;
    }

    const dateError = validateDate(formData.date);
    if (dateError) {
      setMessage(dateError);
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      setMessage("Description cannot be empty or only spaces");
      return;
    }
    if (formData.source === "Other" && !otherSource.trim()) {
      setMessage("Please enter a custom source");
      return;
    }

    const normalizedDate = normalizeDate(formData.date);

    const incomeData: IncomeVM = {
      ...formData,
      amount,
      userId,
      date: normalizedDate,
      source: formData.source === "Other" ? otherSource : formData.source,
    };
    try {
      const url = updateIncome
        ? `${BASE_URL}/income/${updateIncome._id}`
        : `${BASE_URL}/income`;
      const method = updateIncome ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeData),
      });

      if (!res.ok)
        throw new Error(updateIncome ? "Update failed" : "Create failed");

      setMessage(updateIncome ? "Income updated!" : "Income added!");
      setUpdateIncome(null);
      setFormData({
        amount: "",
        source: "",
        description: "",
        date: new Date().toISOString().slice(0, 10), 
      });
      setOtherSource("");

      fetchIncomes(userId, filterSource, sortOption);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !userId || !confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${BASE_URL}/income/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("Income deleted successfully!");
      fetchIncomes(userId, filterSource, sortOption);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete income");
    }
  };

  const handleEdit = (income: IncomeVM) => {
    setUpdateIncome(income);
    setFormData({
      amount: income.amount.toString(),
      source: incomeSources.includes(income.source) ? income.source : "Other",
      description: income.description || "",
      date: new Date(income.date).toISOString().slice(0, 10),
    });
    if (!incomeSources.includes(income.source)) setOtherSource(income.source);
    else setOtherSource("");
  };

  return (
    <div>
      <h2>{updateIncome ? "Update Income" : "Add Income"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label>Source</label>
        <select
          name="source"
          value={formData.source}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value !== "Other") setOtherSource("");
          }}
          required
        >
          <option value="" disabled>
            Select source
          </option>
          {incomeSources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        {formData.source === "Other" && (
          <input
            type="text"
            placeholder="Enter other source"
            value={otherSource}
            onChange={(e) => setOtherSource(e.target.value)}
            required
          />
        )}

        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {updateIncome ? "Update Income" : "Add Income"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* Filter & Sort */}
      <div>
        <label>Filter by Source: </label>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
        >
          <option value="">All</option>
          {incomeSources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        <label> Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">None</option>
          <option value="amountAsc">Amount(Low to High)</option>
          <option value="amountDesc">Amount(High to low)</option>
          <option value="dateAsc">Date(older to newer)</option>
          <option value="dateDesc">Date(newer to older)</option>
        </select>
      </div>
      <h3>Total Income: {totalIncome}</h3>

      {/* Income Table */}
      <table border={1}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Source</th>
            <th>Description</th>
            <th>Date</th>
            <th>Edit/Delete </th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income._id}>
              <td>{income.amount}</td>
              <td>{income.source}</td>
              <td>{income.description}</td>
              <td>{new Date(income.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(income)}>Edit</button>
                <button onClick={() => handleDelete(income._id!)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
