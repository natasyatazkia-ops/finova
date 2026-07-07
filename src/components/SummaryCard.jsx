function SummaryCard({ title, amount, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h3 className="text-gray-500">{title}</h3>

      <p className={`text-3xl font-bold ${color}`}>
        Rp{amount}
      </p>
    </div>
  );
}

export default SummaryCard;