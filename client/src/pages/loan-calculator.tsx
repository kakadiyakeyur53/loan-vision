import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Download, HelpCircle } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LoanInputForm from "@/components/loan-input-form";
import LoanSummary from "@/components/loan-summary";
import PaymentCharts from "@/components/payment-charts";
import PaymentSchedule from "@/components/payment-schedule";
import ScenarioComparison from "@/components/scenario-comparison";
import { 
  calculateLoan, 
  calculateWithAdditionalPayments, 
  generatePaymentSchedule, 
  generateYearlySchedule,
  calculateTimeSaved,
  calculateInterestSaved,
  type LoanInputs 
} from "@/lib/loan-calculations";

export default function LoanCalculator() {
  const [inputs, setInputs] = useState<LoanInputs>({
    loanAmount: 400000,
    interestRate: 5.5,
    loanTermYears: 15,
    termUnit: 'years',
    enableAdditionalPayments: false,
    additionalPaymentAmount: 5000,
    additionalPaymentFrequency: 6
  });

  const [currency, setCurrency] = useState('USD');
  
  // Calculate all scenarios
  const baseResults = calculateLoan(inputs);
  const additionalResults = calculateWithAdditionalPayments(inputs);
  
  // Create 30-year comparison
  const longerTermInputs = { ...inputs, loanTermYears: 30, enableAdditionalPayments: false };
  const longerTermResults = calculateLoan(longerTermInputs);
  
  // Generate payment schedule
  const schedule = generatePaymentSchedule(inputs);
  const yearlySchedule = generateYearlySchedule(schedule);
  
  // Calculate savings
  const timeSaved = calculateTimeSaved(inputs, { ...inputs, enableAdditionalPayments: true });
  const interestSaved = calculateInterestSaved(inputs, { ...inputs, enableAdditionalPayments: true });

  const exportReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text('LoanVision - Loan Analysis Report', margin, 30);
    
    // Current date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 40);
    
    // Loan Details Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Loan Details', margin, 60);
    
    const loanDetailsData = [
      ['Loan Amount', `${currency} ${inputs.loanAmount.toLocaleString()}`],
      ['Interest Rate', `${inputs.interestRate}% per annum`],
      ['Loan Term', `${inputs.loanTermYears} ${inputs.termUnit}`],
      ['Additional Payments', inputs.enableAdditionalPayments ? 'Enabled' : 'Disabled'],
      ...(inputs.enableAdditionalPayments ? [
        ['Additional Amount', `${currency} ${inputs.additionalPaymentAmount.toLocaleString()}`],
        ['Payment Frequency', `Every ${inputs.additionalPaymentFrequency} months`]
      ] : [])
    ];
    
    autoTable(doc, {
      startY: 70,
      head: [['Parameter', 'Value']],
      body: loanDetailsData,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
      margin: { left: margin, right: margin }
    });
    
    // Results Summary
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Loan Summary', margin, finalY);
    
    const activeResults = inputs.enableAdditionalPayments ? additionalResults : baseResults;
    const summaryData = [
      ['Monthly Payment', `${currency} ${activeResults.monthlyPayment.toLocaleString()}`],
      ['Total Interest', `${currency} ${activeResults.totalInterest.toLocaleString()}`],
      ['Total Amount', `${currency} ${activeResults.totalAmount.toLocaleString()}`],
      ['Loan Term', `${(activeResults.totalMonths / 12).toFixed(1)} years`],
      ['Payoff Date', activeResults.payoffDate.toLocaleDateString()]
    ];
    
    if (inputs.enableAdditionalPayments && interestSaved > 0) {
      summaryData.push(['Interest Saved', `${currency} ${interestSaved.toLocaleString()}`]);
      summaryData.push(['Time Saved', `${timeSaved.toFixed(1)} years`]);
    }
    
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: margin, right: margin }
    });
    
    // Scenario Comparison
    if (inputs.enableAdditionalPayments) {
      const finalY2 = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text('Scenario Comparison', margin, finalY2);
      
      const comparisonData = [
        ['Regular Payments', `${(baseResults.totalMonths / 12).toFixed(1)} years`, `${currency} ${baseResults.totalInterest.toLocaleString()}`],
        ['With Extra Payments', `${(additionalResults.totalMonths / 12).toFixed(1)} years`, `${currency} ${additionalResults.totalInterest.toLocaleString()}`],
        ['30 Year Term', '30.0 years', `${currency} ${longerTermResults.totalInterest.toLocaleString()}`]
      ];
      
      autoTable(doc, {
        startY: finalY2 + 10,
        head: [['Scenario', 'Time to Pay Off', 'Total Interest']],
        body: comparisonData,
        theme: 'striped',
        headStyles: { fillColor: [255, 152, 0] },
        margin: { left: margin, right: margin }
      });
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This report is for informational purposes only. Consult a financial advisor for personalized advice.', 
             margin, pageHeight - 20);
    
    // Save the PDF
    doc.save('loan-analysis-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <Calculator className="mr-2" size={24} />
                LoanVision
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle size={20} />
              </Button>
              <Button onClick={exportReport} className="bg-primary hover:bg-primary/90">
                <Download className="mr-2" size={16} />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-1">
            <LoanInputForm
              inputs={inputs}
              currency={currency}
              onInputsChange={setInputs}
              onCurrencyChange={setCurrency}
            />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Loan Summary */}
            <LoanSummary
              results={baseResults}
              resultsWithAdditional={additionalResults}
              currency={currency}
              timeSaved={timeSaved}
              interestSaved={interestSaved}
            />

            {/* Charts */}
            <PaymentCharts
              results={inputs.enableAdditionalPayments ? additionalResults : baseResults}
              schedule={schedule}
              currency={currency}
            />

            {/* Payment Schedule */}
            <PaymentSchedule
              schedule={schedule}
              yearlySchedule={yearlySchedule}
              currency={currency}
            />

            {/* Scenario Comparison */}
            <ScenarioComparison
              baseResults={baseResults}
              additionalResults={additionalResults}
              longerTermResults={longerTermResults}
              currency={currency}
              interestSaved={interestSaved}
              timeSaved={timeSaved}
            />

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 LoanVision. This calculator provides estimates for educational purposes only.</p>
            <p className="mt-2">Always consult with a financial advisor for personalized advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
