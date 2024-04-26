import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Modal from 'react-modal';
import { useSnackbar } from 'notistack';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import { FaArrowLeft, FaArrowRight , FaEdit, FaTrash,} from 'react-icons/fa'; 
import './NewExpense.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4500']; 
const NewExpense = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(4500);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(3);
  const [isTrendModalOpen, setIsTrendModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const closeTrendModalHandler = () => {
    setIsTrendModalOpen(false);
  };

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: editingTransaction ? editingTransaction.id : Math.random().toString(), // Use existing ID if editing
    };
    if (editingTransaction) {
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === editingTransaction.id ? expenseData : transaction
        )
      );
    } else {
      setTransactions([...transactions, expenseData]);
    }
    props.onAddExpense(expenseData);
  setIsEditingExpense(false);
  setEditingTransaction(null);
  setWalletBalance(prevBalance => {
    if (editingTransaction) {
      return prevBalance + parseFloat(editingTransaction.amount) - parseFloat(enteredExpenseData.amount);
    } else {
      return prevBalance - parseFloat(enteredExpenseData.amount);
    }
  });
  
  enqueueSnackbar('Expense added successfully!', { variant: 'success' });
};

  const saveIncomeDataHandler = (enteredIncomeData) => {
    setIsEditingIncome(false);
    const newBalance = walletBalance + parseFloat(enteredIncomeData.amount);
    setWalletBalance(newBalance);
    enqueueSnackbar('Income added successfully!', { variant: 'success' });
  };

  const startEditingExpenseHandler = () => {
    setIsEditingExpense(true);
  };

  const startEditingIncomeHandler = () => {
    setIsEditingIncome(true);
  };

  const stopEditingHandler = () => {
    setIsEditingExpense(false);
    setIsEditingIncome(false);
    setEditingTransaction(null);
  };

  const getCategoryExpenses = () => {
    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      if (transaction.title) {
        if (!categoryExpenses[transaction.category]) {
          categoryExpenses[transaction.category] = parseFloat(transaction.amount);
        } else {
          categoryExpenses[transaction.category] += parseFloat(transaction.amount);
        }
      }
    });

    return categoryExpenses;
  };

  const renderTrendChart = () => {
    const categoryExpenses = getCategoryExpenses();
    const data = Object.keys(categoryExpenses).map((category) => ({
      category,
      amount: categoryExpenses[category],
    }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderExpenseSummary = () => {
    const categoryExpenses = getCategoryExpenses();
    const totalExpenses = Object.values(categoryExpenses).reduce((acc, val) => acc + val, 0);
    const data = Object.keys(categoryExpenses).map((category, index) => ({
      name: category,
      value: categoryExpenses[category],
      fill: COLORS[index % COLORS.length],
    }));

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percentage }) => `${name} (${((categoryExpenses[name] / totalExpenses) * 100).toFixed(2)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const totalTransactions = transactions.filter(transaction => transaction.title).length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.filter(transaction => transaction.title).slice(indexOfFirstTransaction, indexOfLastTransaction);

  const deleteTransactionHandler = (transactionId) => {
    setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== transactionId));
  };

  const editTransactionHandler = (transactionId) => {
    const transactionToEdit = transactions.find(transaction => transaction.id === transactionId);
    setEditingTransaction(transactionToEdit);
    setIsEditingExpense(true);
  };

  // const editTransactionHandler = (transactionId) => {
  //   if (props.transactions && props.transactions.length > 0) {
  //     const transactionToEdit = props.transactions.find(transaction => transaction.id === transactionId);
  //     if (transactionToEdit) {
  //       setEditingTransaction(transactionToEdit);
  //       setIsEditingExpense(true);
  //     } else {
  //       console.error(`Transaction with ID ${transactionId} not found.`);
  //     }
  //   } else {
  //     console.error("Transactions array is empty or not initialized.");
  //   }
  // };
  
  
  

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className='new-expense'>
      <div className="expense-main">
        {!isEditingExpense && !isEditingIncome && (
          <React.Fragment>
            <h2>Wallet Balance: ${walletBalance}</h2>
            <button className="alternative" onClick={startEditingExpenseHandler}>Add Expense</button>
            <h2>Total Expenses: ${transactions.reduce((total, transaction) => {
              if (!transaction.title) return total;
              return total + parseFloat(transaction.amount);
            }, 0)}</h2>
            <button className="alternative" onClick={startEditingIncomeHandler}>Add Income</button>
          </React.Fragment>
        )}
        {isEditingExpense && (
          <ExpenseForm
            onSaveExpenseData={saveExpenseDataHandler}
            onCancel={stopEditingHandler}
            editingTransaction={editingTransaction}
          />
        )}
        {isEditingIncome && (
          <IncomeForm
            onSaveIncomeData={saveIncomeDataHandler}
            onCancel={stopEditingHandler}
          />
        )}
        <div className='recent-transactions-container'>
  <div className='recent-transactions'>
    <h2>Recent Transactions</h2>
    <ul>
      {currentTransactions.map((transaction, index) => (
        <li key={index}>
          <div className="transaction-details">
            <span>
              {transaction.title ? `${transaction.title}` : `Income`}
            </span>
            {transaction.date && (
              <span className="transaction-date">
                {new Date(transaction.date).toLocaleDateString()}
              </span>
            )}
            <span>
              - ${transaction.amount}
            </span>
          </div>
          <div className="icon-container">
            <FaEdit onClick={() => editTransactionHandler(transaction.id)} />
            <FaTrash onClick={() => deleteTransactionHandler(transaction.id)} />
          </div>
        </li>
      ))}
    </ul>
  </div>
  <div className="pagination">
    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
      <FaArrowLeft />
    </button>
    {getPageNumbers().map(number => (
      <button key={number} onClick={() => changePage(number)} className={currentPage === number ? 'active' : ''}>
        {number}
      </button>
    ))}
    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
      <FaArrowRight />
    </button>
  </div>
</div>
</div>
      <div className="expense-summary">
        <h2>Expense Summary</h2>
        {renderExpenseSummary()}
      </div>
      <Modal
        isOpen={isTrendModalOpen}
        onRequestClose={closeTrendModalHandler}
        contentLabel="Expense Trends Modal"
      >
        <h2>Expense Trends</h2>
        {renderTrendChart()}
        <button onClick={closeTrendModalHandler}>Close</button>
      </Modal>
      <div className="trend-chart-container">
        <h2>Expense Trends</h2>
        {renderTrendChart()}
      </div>
    </div>
  );
};

export default NewExpense;






