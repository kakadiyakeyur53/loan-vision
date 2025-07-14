import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import type { LoanResults } from "@/lib/loan-calculations";

interface LoanSummaryProps {
  results: LoanResults;
  resultsWithAdditional: LoanResults;
  currency: string;
  timeSaved: number;
  interestSaved: number;
}

export default function LoanSummary({ 
  results, 
  resultsWithAdditional, 
  currency, 
  timeSaved, 
  interestSaved 
}: LoanSummaryProps) {
  const activeResults = resultsWithAdditional.totalMonths < results.totalMonths ? resultsWithAdditional : results;
  
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="text-green-600 mr-2" size={20} />
          Loan Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-blue-600 mb-1">Monthly Payment</div>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(activeResults.monthlyPayment, currency)}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm font-medium text-green-600 mb-1">Total Interest</div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(activeResults.totalInterest, currency)}
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-sm font-medium text-yellow-600 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-yellow-700">
              {formatCurrency(activeResults.totalAmount, currency)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {timeSaved > 0 ? 'Time Saved' : 'Loan Term'}
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {timeSaved > 0 ? `${timeSaved.toFixed(1)} years` : `${(activeResults.totalMonths / 12).toFixed(1)} years`}
            </div>
          </div>
        </div>

        {interestSaved > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <TrendingUp className="text-green-600 mr-2" size={16} />
              <span className="text-sm font-medium text-green-800">
                Total Interest Savings: {formatCurrency(interestSaved, currency)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
