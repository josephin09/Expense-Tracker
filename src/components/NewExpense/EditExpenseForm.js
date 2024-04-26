import React, { useState } from 'react';

const EditExpenseForm = ({ expense, onSaveExpenseData, onCancel }) => {
    const [enteredTitle, setEnteredTitle] = useState(expense ? expense.title : '');
    const [enteredAmount, setEnteredAmount] = useState(expense ? expense.amount : '');
    const [enteredCategory, setEnteredCategory] = useState(expense ? expense.category : '');

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const categoryChangeHandler = (event) => {
    setEnteredCategory(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
  
    const expenseData = {
      id: expense.id, // Include id of the edited expense
      title: enteredTitle,
      amount: enteredAmount,
      category: enteredCategory,
    };
  
    onSaveExpenseData(expenseData);
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>Title</label>
        <input type="text" value={enteredTitle} onChange={titleChangeHandler} />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" value={enteredAmount} onChange={amountChangeHandler} />
      </div>
      <div>
        <label>Category</label>
        <input type="text" value={enteredCategory} onChange={categoryChangeHandler} />
      </div>
      <button type="button" onClick={onCancel}>Cancel</button>
      <button type="submit">Update</button>
    </form>
  );
};

export default EditExpenseForm;
