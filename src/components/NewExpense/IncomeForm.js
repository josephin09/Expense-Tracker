import React, { useState } from 'react';
import './IncomeForm.css'; 

const IncomeForm = (props) => {
  const [enteredAmount, setEnteredAmount] = useState('');

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const incomeData = {
      amount: enteredAmount,
    };

    props.onSaveIncomeData(incomeData);
    setEnteredAmount('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className='income-form__controls'>
        <div className='income-form__control'>
        <h2>Add Balance</h2>
          <label>Amount</label>
          <input
            type='text'
            value={enteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
      </div>
      <div className='income-form__actions'>
        <button type="button" onClick={props.onCancel}>Cancel</button>
        <button type='submit'>Add Income</button>
      </div>
    </form>
  );
};

export default IncomeForm;
