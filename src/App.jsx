import { useState, useEffect } from "react";
import SummaryCard from "./components/SummaryCard";

function App() {
  // State transaksi
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [editId, setEditId] = useState(null);

  // Ambil data dari localStorage saat aplikasi dibuka
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Simpan data ke localStorage setiap transaksi berubah
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // State form
  const [form, setForm] = useState({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  // State pencarian
  const [search, setSearch] = useState("");

  // Hitung total
  const totalIncome = transactions
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpense = transactions
    .filter((item) => item.type === "Expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = totalIncome - totalExpense;

  // Tambah transaksi
  const handleAddTransaction = () => {
  if (!form.amount || !form.category || !form.date) {
    alert("Lengkapi data terlebih dahulu!");
    return;
  }

  if (editId) {
    // Update transaksi
    const updatedTransactions = transactions.map((item) =>
      item.id === editId
        ? {
            ...item,
            ...form,
          }
        : item
    );

    setTransactions(updatedTransactions);
    setEditId(null);
  } else {
    // Tambah transaksi baru
    const newTransaction = {
      id: Date.now(),
      ...form,
    };

    setTransactions([...transactions, newTransaction]);
  }

  // Reset form
  setForm({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    note: "",
  });
};

  // Hapus transaksi
  // Edit
const handleEdit = (item) => {
  setForm({
    type: item.type,
    amount: item.amount,
    category: item.category,
    date: item.date,
    note: item.note,
  });

  setEditId(item.id);
};

// Hapus
const handleDelete = (id) => {
  setTransactions(
    transactions.filter((item) => item.id !== id)
  );
};

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-purple-700 text-white py-6 shadow-lg">
        <h1 className="text-4xl font-bold text-center">
          💜 Finova
        </h1>

        <p className="text-center mt-2">
          Smart Finance, Better Future
        </p>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">
          Dashboard
        </h2>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-5">
          <SummaryCard
            title="Saldo"
            amount={balance}
            color="text-purple-700"
          />

          <SummaryCard
            title="Income"
            amount={totalIncome}
            color="text-green-600"
          />

          <SummaryCard
            title="Expense"
            amount={totalExpense}
            color="text-red-600"
          />
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Tambah Transaksi
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <select
              className="border rounded-lg p-3"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option>Income</option>
              <option>Expense</option>
            </select>

            <input
              type="number"
              placeholder="Nominal"
              className="border rounded-lg p-3"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Kategori"
              className="border rounded-lg p-3"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <input
              type="date"
              className="border rounded-lg p-3"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <textarea
              placeholder="Catatan"
              className="border rounded-lg p-3 md:col-span-2"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />

          </div>

          <button
            onClick={handleAddTransaction}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg mt-5"
          >
            {editId ? "Update Transaksi" : "Tambah Transaksi"}
          </button>
        </div>


        {/* Search */}
        <div className="mt-8 flex gap-4">

          <select
            className="border rounded-lg p-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Semua</option>
            <option>Income</option>
            <option>Expense</option>
          </select>

          <input
            type="text"
            placeholder="🔍 Cari kategori..."
            className="flex-1 border rounded-lg p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Riwayat */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Riwayat Transaksi
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">
              Belum ada transaksi.
            </p>
          ) : (
            <div className="space-y-4">
              {transactions
                  .filter((item) => {
                    const cocokKategori = item.category
                      .toLowerCase()
                      .includes(search.toLowerCase());

                    const cocokFilter =
                      filter === "Semua"
                        ? true
                        : item.type === filter;

                    return cocokKategori && cocokFilter;
                  })
                   .map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">
                      {item.category}
                    </h3>

                    <p className="text-gray-500">
                      {item.note}
                    </p>

                    <p className="text-sm text-gray-400">
                      {item.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-xl ${
                        item.type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.type === "Income" ? "+" : "-"}Rp
                      {Number(item.amount).toLocaleString("id-ID")}
                    </p>

                   <div className="mt-2 flex gap-2 justify-end">
  <button
    onClick={() => handleEdit(item)}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(item.id)}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
  >
    Hapus
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
export default App;