const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Income Source
exports.addExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Gett all Income category
exports.getAllExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expense);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// delete Expense category
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Download Expense Excel sheet
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // prepare data for the excel sheet
    const data = expense.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toDateString(),
    }));

    // create excel sheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
