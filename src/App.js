import React from 'react';
import { SnackbarProvider } from 'notistack';
import NewExpense from './components/NewExpense/NewExpense';
import './App.css';

function App() {
  const addExpenseHandler = (expenseData) => {
    console.log('Adding expense:', expenseData);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="app">
        <h1 style={{ textAlign: 'center' }}>Expense Tracker</h1>
        <NewExpense onAddExpense={addExpenseHandler} />
      </div>
    </SnackbarProvider>
  );
}

export default App;

