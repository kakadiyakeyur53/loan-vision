import { Card, CardContent } from "@/components/ui/card";
import { Scale, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import type { LoanResults } from "@/lib/loan-calculations";

interface ScenarioComparisonProps {
  baseResults: LoanResults;
  additionalResults: LoanResults;
  longerTermResults: LoanResults;
  currency: string;
  interestSaved: number;
  timeSaved: number;
}

export default function ScenarioComparison({ 
  baseResults, 
  additionalResults, 
  longerTermResults,
  currency, 
  interestSaved, 
  timeSaved 
}: ScenarioComparisonProps) {
  
  const longerTermDiff = longerTermResults.totalInterest - baseResults.totalInterest;
  
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Scale className="text-primary mr-2" size={20} />
          Scenario Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-600 mb-2">Current Plan</div>
              <div className="text-xl font-bold text-blue-700">
                {(baseResults.totalMonths / 12).toFixed(1)} Years
              </div>
              <div className="text-sm text-blue-600">
                {formatCurrency(baseResults.totalInterest, currency)} interest
              </div>
            </div>
          </div>
          
          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <div className="text-center">
              <div className="text-sm font-medium text-green-600 mb-2">With Extra Payments</div>
              <div className="text-xl font-bold text-green-700">
                {(additionalResults.totalMonths / 12).toFixed(1)} Years
              </div>
              <div className="text-sm text-green-600">
                {formatCurrency(additionalResults.totalInterest, currency)} interest
              </div>
              {interestSaved > 0 && (
                <div className="text-xs text-green-500 mt-1">
                  Save {formatCurrency(interestSaved, currency)}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">30 Year Term</div>
              <div className="text-xl font-bold text-gray-700">30 Years</div>
              <div className="text-sm text-gray-600">
                {formatCurrency(longerTermResults.totalInterest, currency)} interest
              </div>
              <div className="text-xs text-red-500 mt-1">
                +{formatCurrency(longerTermDiff, currency)} more
              </div>
            </div>
          </div>
        </div>
        
        {interestSaved > 0 && timeSaved > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Lightbulb className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Recommendation</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Based on your inputs, making additional payments could save you{' '}
                  <span className="font-semibold">{formatCurrency(interestSaved, currency)}</span> in interest
                  and help you pay off your loan{' '}
                  <span className="font-semibold">{timeSaved.toFixed(1)} years</span> earlier.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
