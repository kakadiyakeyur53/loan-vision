import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calculator, Plus } from "lucide-react";
import { currencies, getCurrencySymbol } from "@/lib/currency-utils";
import type { LoanInputs } from "@/lib/loan-calculations";

interface LoanInputFormProps {
  inputs: LoanInputs;
  currency: string;
  onInputsChange: (inputs: LoanInputs) => void;
  onCurrencyChange: (currency: string) => void;
}

export default function LoanInputForm({ 
  inputs, 
  currency, 
  onInputsChange, 
  onCurrencyChange 
}: LoanInputFormProps) {
  const [localInputs, setLocalInputs] = useState(inputs);

  useEffect(() => {
    setLocalInputs(inputs);
  }, [inputs]);

  const updateInputs = (updates: Partial<LoanInputs>) => {
    const newInputs = { ...localInputs, ...updates };
    setLocalInputs(newInputs);
    onInputsChange(newInputs);
  };

  const handleSliderChange = (field: keyof LoanInputs, value: number[]) => {
    updateInputs({ [field]: value[0] });
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calculator className="text-primary mr-2" size={20} />
          Loan Details
        </h2>
        
        {/* Loan Amount Section */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2">Loan Amount</Label>
          <div className="flex">
            <Select value={currency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-24 rounded-r-none border-r-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} {curr.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={localInputs.loanAmount || ''}
              onChange={(e) => updateInputs({ loanAmount: Number(e.target.value) || 0 })}
              placeholder="100,000"
              className="flex-1 rounded-l-none"
            />
          </div>
          <div className="mt-2">
            <Slider
              value={[localInputs.loanAmount]}
              onValueChange={(value) => handleSliderChange('loanAmount', value)}
              min={1000}
              max={1000000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{getCurrencySymbol(currency)}1K</span>
              <span>{getCurrencySymbol(currency)}1M</span>
            </div>
          </div>
        </div>

        {/* Interest Rate Section */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2">Annual Interest Rate (%)</Label>
          <div className="relative">
            <Input
              type="number"
              value={localInputs.interestRate || ''}
              onChange={(e) => updateInputs({ interestRate: Number(e.target.value) || 0 })}
              placeholder="5.5"
              step="0.1"
              min="0.1"
              max="30"
              className="pr-8"
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
          <div className="mt-2">
            <Slider
              value={[localInputs.interestRate]}
              onValueChange={(value) => handleSliderChange('interestRate', value)}
              min={0.1}
              max={30}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {/* Loan Term Section */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2">Loan Term</Label>
          <div className="flex space-x-2">
            <Input
              type="number"
              value={localInputs.loanTermYears || ''}
              onChange={(e) => updateInputs({ loanTermYears: Number(e.target.value) || 0 })}
              placeholder="15"
              min="1"
              max="50"
              className="flex-1"
            />
            <Select value={localInputs.termUnit} onValueChange={(value: 'years' | 'months') => updateInputs({ termUnit: value })}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="years">Years</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Payments Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Plus className="text-green-600 mr-2" size={20} />
            Additional Payments
          </h3>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="additional-payments"
                checked={localInputs.enableAdditionalPayments}
                onCheckedChange={(checked) => updateInputs({ enableAdditionalPayments: !!checked })}
              />
              <Label htmlFor="additional-payments" className="text-sm text-gray-700">
                Enable additional payments
              </Label>
            </div>
          </div>

          <div className={`space-y-4 ${!localInputs.enableAdditionalPayments ? 'opacity-50' : ''}`}>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Payment Frequency</Label>
              <Select 
                value={localInputs.additionalPaymentFrequency.toString()} 
                onValueChange={(value) => updateInputs({ additionalPaymentFrequency: Number(value) })}
                disabled={!localInputs.enableAdditionalPayments}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Every 3 months</SelectItem>
                  <SelectItem value="6">Every 6 months</SelectItem>
                  <SelectItem value="12">Every 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Additional Amount</Label>
              <Input
                type="number"
                value={localInputs.additionalPaymentAmount || ''}
                onChange={(e) => updateInputs({ additionalPaymentAmount: Number(e.target.value) || 0 })}
                placeholder="5,000"
                disabled={!localInputs.enableAdditionalPayments}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
