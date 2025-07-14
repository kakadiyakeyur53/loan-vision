export interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  termUnit: 'years' | 'months';
  enableAdditionalPayments: boolean;
  additionalPaymentAmount: number;
  additionalPaymentFrequency: number; // 3, 6, or 12 months
}

export interface LoanResults {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  totalMonths: number;
  payoffDate: Date;
}

export interface PaymentScheduleItem {
  month: number;
  year: number;
  beginningBalance: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  additionalPayment: number;
  totalPayment: number;
  endingBalance: number;
}

export interface YearlyScheduleItem {
  year: number;
  beginningBalance: number;
  totalPrincipal: number;
  totalInterest: number;
  totalAdditional: number;
  endingBalance: number;
}

export function calculateLoan(inputs: LoanInputs): LoanResults {
  const { loanAmount, interestRate, loanTermYears, termUnit } = inputs;
  
  // Convert to months
  const totalMonths = termUnit === 'years' ? loanTermYears * 12 : loanTermYears;
  
  // Monthly interest rate
  const monthlyRate = interestRate / 100 / 12;
  
  // Calculate monthly payment using standard formula
  const monthlyPayment = monthlyRate === 0 
    ? loanAmount / totalMonths
    : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  const totalAmount = monthlyPayment * totalMonths;
  const totalInterest = totalAmount - loanAmount;
  
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + totalMonths);
  
  return {
    monthlyPayment,
    totalInterest,
    totalAmount,
    totalMonths,
    payoffDate
  };
}

export function calculateWithAdditionalPayments(inputs: LoanInputs): LoanResults {
  if (!inputs.enableAdditionalPayments) {
    return calculateLoan(inputs);
  }
  
  const { loanAmount, interestRate, additionalPaymentAmount, additionalPaymentFrequency } = inputs;
  const monthlyRate = interestRate / 100 / 12;
  const basePayment = calculateLoan(inputs).monthlyPayment;
  
  let balance = loanAmount;
  let totalInterest = 0;
  let month = 0;
  
  while (balance > 0.01 && month < 600) { // Max 50 years safety
    month++;
    
    const interestPayment = balance * monthlyRate;
    let principalPayment = basePayment - interestPayment;
    
    // Add additional payment if applicable
    let additionalPayment = 0;
    if (month % additionalPaymentFrequency === 0) {
      additionalPayment = additionalPaymentAmount;
    }
    
    // Don't overpay
    const totalPrincipal = principalPayment + additionalPayment;
    if (totalPrincipal > balance) {
      principalPayment = balance;
      additionalPayment = 0;
    }
    
    balance -= (principalPayment + additionalPayment);
    totalInterest += interestPayment;
  }
  
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);
  
  return {
    monthlyPayment: basePayment,
    totalInterest,
    totalAmount: loanAmount + totalInterest,
    totalMonths: month,
    payoffDate
  };
}

export function generatePaymentSchedule(inputs: LoanInputs): PaymentScheduleItem[] {
  const { loanAmount, interestRate } = inputs;
  const monthlyRate = interestRate / 100 / 12;
  const basePayment = calculateLoan(inputs).monthlyPayment;
  
  let balance = loanAmount;
  const schedule: PaymentScheduleItem[] = [];
  let month = 0;
  
  while (balance > 0.01 && month < 600) {
    month++;
    const beginningBalance = balance;
    
    const interestPayment = balance * monthlyRate;
    let principalPayment = basePayment - interestPayment;
    
    // Add additional payment if applicable
    let additionalPayment = 0;
    if (inputs.enableAdditionalPayments && month % inputs.additionalPaymentFrequency === 0) {
      additionalPayment = inputs.additionalPaymentAmount;
    }
    
    // Don't overpay
    const totalPrincipal = principalPayment + additionalPayment;
    if (totalPrincipal > balance) {
      principalPayment = balance;
      additionalPayment = 0;
    }
    
    balance -= (principalPayment + additionalPayment);
    
    schedule.push({
      month,
      year: Math.ceil(month / 12),
      beginningBalance,
      monthlyPayment: basePayment,
      principalPayment,
      interestPayment,
      additionalPayment,
      totalPayment: basePayment + additionalPayment,
      endingBalance: balance
    });
  }
  
  return schedule;
}

export function generateYearlySchedule(schedule: PaymentScheduleItem[]): YearlyScheduleItem[] {
  const yearlySchedule: YearlyScheduleItem[] = [];
  
  let currentYear = 1;
  let yearData = {
    year: currentYear,
    beginningBalance: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    totalAdditional: 0,
    endingBalance: 0
  };
  
  schedule.forEach((payment, index) => {
    if (payment.year !== currentYear) {
      // Finish current year
      yearlySchedule.push(yearData);
      
      // Start new year
      currentYear = payment.year;
      yearData = {
        year: currentYear,
        beginningBalance: payment.beginningBalance,
        totalPrincipal: 0,
        totalInterest: 0,
        totalAdditional: 0,
        endingBalance: 0
      };
    }
    
    if (index === 0 || payment.year !== schedule[index - 1]?.year) {
      yearData.beginningBalance = payment.beginningBalance;
    }
    
    yearData.totalPrincipal += payment.principalPayment;
    yearData.totalInterest += payment.interestPayment;
    yearData.totalAdditional += payment.additionalPayment;
    yearData.endingBalance = payment.endingBalance;
  });
  
  // Add the last year
  if (schedule.length > 0) {
    yearlySchedule.push(yearData);
  }
  
  return yearlySchedule;
}

export function calculateTimeSaved(baseInputs: LoanInputs, withAdditionalInputs: LoanInputs): number {
  const baseResults = calculateLoan(baseInputs);
  const additionalResults = calculateWithAdditionalPayments(withAdditionalInputs);
  
  return (baseResults.totalMonths - additionalResults.totalMonths) / 12;
}

export function calculateInterestSaved(baseInputs: LoanInputs, withAdditionalInputs: LoanInputs): number {
  const baseResults = calculateLoan(baseInputs);
  const additionalResults = calculateWithAdditionalPayments(withAdditionalInputs);
  
  return baseResults.totalInterest - additionalResults.totalInterest;
}
