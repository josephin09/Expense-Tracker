import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onSaveExpenseData, onCancel, editingTransaction }) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredCategory, setEnteredCategory] = useState('');
  const [enteredDate, setEnteredDate] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setEnteredTitle(editingTransaction.title);
      setEnteredAmount(editingTransaction.amount);
      setEnteredCategory(editingTransaction.category);
      setEnteredDate(editingTransaction.date); // Assuming date is a string in ISO format
    }
  }, [editingTransaction]);

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const categoryChangeHandler = (event) => {
    setEnteredCategory(event.target.value);
  };

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      category: enteredCategory,
      date: enteredDate,
    };

    onSaveExpenseData(expenseData);
    setEnteredTitle('');
    setEnteredAmount('');
    setEnteredCategory('');
    setEnteredDate('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className='new-expense__controls'>
        <div className='new-expense__control'>
          <label>Title</label>
          <input type="text" value={enteredTitle} onChange={titleChangeHandler} />
        </div>
        <div className='new-expense__control'>
          <label>Amount</label>
          <input type="number" value={enteredAmount} onChange={amountChangeHandler} />
        </div>
        <div className='new-expense__control'>
          <label>Date</label>
          <input type="date" value={enteredDate} onChange={dateChangeHandler} />
        </div>
        <div className='new-expense__control'>
          <label>Category</label>
          <select value={enteredCategory} onChange={categoryChangeHandler}>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <div className='new-expense__actions'>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{editingTransaction ? 'Update' : 'Add Expense'}</button>
      </div>
    </form>
  );
};

export default ExpenseForm;

