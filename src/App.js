import React, { useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import jsPDF from 'jspdf';


function App() {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('annually');
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [interestType, setInterestType] = useState('flat_rate');
  const [selectedBank, setSelectedBank] = useState('bankA');
  const [instalments, setInstalments] = useState([]);
  const [processingFees, setProcessingFees] = useState(0);
  const [exciseDuty, setExciseDuty] = useState(0);
  const [totalCharges, setTotalCharges] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [takeHomeAmount, setTakeHomeAmount] = useState(0);

  const calculateTotalCost = (amount, interest_rate, period) => {
    const totalInterest = amount * interest_rate * period;
    return totalInterest;
  };

  const calculateInstalments = (amount, interest_rate, period, start_date, frequency) => {
    let instalments = [];
    let principal = amount;

    for (let i = 0; i < period; i++) {
      let interestAmount = 0;

      if (frequency === "annually") {
        interestAmount = principal * interest_rate;
      } else if (frequency === "quarterly") {
        interestAmount = (principal * interest_rate) / 4;
      } else if (frequency === "monthly") {
        interestAmount = (principal * interest_rate) / 12;
      } else if (frequency === "every6months") {
        interestAmount = (principal * interest_rate) / 2;
      }

      let totalAmount = principal + interestAmount;

      instalments.push({
        "Payment Date": formatDate(start_date),
        "Instalment Amount": totalAmount.toFixed(2),
      });

      if (frequency === "annually") {
        start_date.setFullYear(start_date.getFullYear() + 1);
      } else if (frequency === "quarterly") {
        start_date.setMonth(start_date.getMonth() + 3);
      } else if (frequency === "monthly") {
        start_date.setMonth(start_date.getMonth() + 1);
      } else if (frequency === "every6months") {
        start_date.setMonth(start_date.getMonth() + 6);
      }

      principal -= amount / period;
    }

    return instalments;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCalculate = () => {
    const amountValue = parseFloat(amount);
    const periodValue = parseInt(period);
    const startDateValue = new Date(startDate);

    let interestRate = 0;
    let processingFeesValue = 0;
    let exciseDutyValue = 0;

    if (selectedBank === "bankA") {
      if (interestType === "flat_rate") {
        interestRate = 0.20;
      } else if (interestType === "reducing_balance") {
        interestRate = 0.22;
      }
      processingFeesValue = 0.03 * amountValue;
      exciseDutyValue = 0.20 * processingFeesValue;
    } else if (selectedBank === "bankB") {
      if (interestType === "flat_rate") {
        interestRate = 0.18;
      } else if (interestType === "reducing_balance") {
        interestRate = 0.25;
      }
      processingFeesValue = 0.03 * amountValue;
      exciseDutyValue = 0.20 * processingFeesValue;
    }

    const legalFeesValue = 10000;
    const totalChargesValue = processingFeesValue + exciseDutyValue + legalFeesValue;
    const totalCostValue = calculateTotalCost(amountValue, interestRate, periodValue);
    const takeHomeAmountValue = amountValue - totalChargesValue;

    const instalmentsData = calculateInstalments(amountValue, interestRate, periodValue, startDateValue, frequency);

    setProcessingFees(processingFeesValue);
    setExciseDuty(exciseDutyValue);
    setTotalCharges(totalChargesValue);
    setTotalCost(totalCostValue);
    setTakeHomeAmount(takeHomeAmountValue);
    setInstalments(instalmentsData);
  };

  

  const handleGeneratePDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        html: "#instalments",
        startY: 15,
      });
      doc.save("loan_instalments.pdf");

    }
  
  return (
    <div>
      <h1>Loan Calculator</h1>
      <form id="loan-form">
        <label htmlFor="bank">Select a Bank:</label>
        <select id="bank" name="bank" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
          <option value="bankA">Bank A</option>
          <option value="bankB">Bank B</option>
        </select><br />

        <label htmlFor="amount">Amount to Borrow:</label>
        <input type="number" id="amount" required value={amount} onChange={(e) => setAmount(e.target.value)} /><br />

        <label htmlFor="frequency">Payment Frequency:</label>
        <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="annually">Annually</option>
          <option value="quarterly">Quarterly</option>
          <option value="monthly">Monthly</option>
          <option value="every6months">Every 6 Months</option>
        </select><br />

        <label htmlFor="period">Loan Period (in years):</label>
        <input type="number" id="period" required value={period} onChange={(e) => setPeriod(e.target.value)} /><br />

        <label htmlFor="start-date">Start Date:</label>
        <input type="date" id="start_date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} /><br />

        <label htmlFor="interest_type">Interest Type:</label>
        <select id="interest_type" value={interestType} onChange={(e) => setInterestType(e.target.value)}>
          <option value="flat_rate">Flat Rate</option>
          <option value="reducing_balance">Reducing Balance</option>
        </select><br />

        <button type="button" id="calculate" onClick={handleCalculate}>Calculate</button>
        <button type="button" id="generate-pdf" style={{ display: (instalments.length > 0) ? 'block' : 'none' }} onClick={handleGeneratePDF}>Generate PDF</button>
      </form>

      <div id="results" style={{ display: (instalments.length > 0) ? 'block' : 'none' }}>
        <h2>Loan Details</h2>
        <table id="instalments" className="display" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Payment Date</th>
              <th>Instalment Amount</th>
            </tr>
          </thead>
          <tbody>
            {instalments.map((instalment, index) => (
              <tr key={index}>
                <td>{instalment["Payment Date"]}</td>
                <td>{instalment["Instalment Amount"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Charges:</h3>
        <ul>
          <li>Processing Fees: {processingFees}</li>
          <li>Excise Duty: {exciseDuty}</li>
          <li>Legal Fees: KES 10,000</li>
        </ul>
        <h3>Total Cost: {totalCost}</h3>
        <h3>Take Home Amount: {takeHomeAmount}</h3>
      </div>
    </div>
  );


}

export default App;

