import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CalendarDays, ChevronDown, Download } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import type { PaymentScheduleItem, YearlyScheduleItem } from "@/lib/loan-calculations";

interface PaymentScheduleProps {
  schedule: PaymentScheduleItem[];
  yearlySchedule: YearlyScheduleItem[];
  currency: string;
}

export default function PaymentSchedule({ schedule, yearlySchedule, currency }: PaymentScheduleProps) {
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [showAll, setShowAll] = useState(false);

  const displayData = viewMode === 'yearly' ? yearlySchedule : schedule;
  const itemsToShow = showAll ? displayData : displayData.slice(0, 5);

  const exportSchedule = () => {
    const csvContent = viewMode === 'yearly' 
      ? [
          ['Year', 'Beginning Balance', 'Principal', 'Interest', 'Additional', 'Ending Balance'],
          ...yearlySchedule.map(item => [
            item.year,
            item.beginningBalance.toFixed(2),
            item.totalPrincipal.toFixed(2),
            item.totalInterest.toFixed(2),
            item.totalAdditional.toFixed(2),
            item.endingBalance.toFixed(2)
          ])
        ]
      : [
          ['Month', 'Year', 'Beginning Balance', 'Monthly Payment', 'Principal', 'Interest', 'Additional', 'Ending Balance'],
          ...schedule.map(item => [
            item.month,
            item.year,
            item.beginningBalance.toFixed(2),
            item.monthlyPayment.toFixed(2),
            item.principalPayment.toFixed(2),
            item.interestPayment.toFixed(2),
            item.additionalPayment.toFixed(2),
            item.endingBalance.toFixed(2)
          ])
        ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `loan-schedule-${viewMode}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="text-primary mr-2" size={20} />
            Payment Schedule
          </h3>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'monthly' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('monthly')}
            >
              <CalendarDays className="mr-1" size={16} />
              Monthly
            </Button>
            <Button
              variant={viewMode === 'yearly' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('yearly')}
            >
              <Calendar className="mr-1" size={16} />
              Yearly
            </Button>
            <Button variant="outline" size="sm" onClick={exportSchedule}>
              <Download className="mr-1" size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {viewMode === 'yearly' ? (
                  <>
                    <TableHead>Year</TableHead>
                    <TableHead>Beginning Balance</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Additional</TableHead>
                    <TableHead>Ending Balance</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Month</TableHead>
                    <TableHead>Beginning Balance</TableHead>
                    <TableHead>Monthly Payment</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Additional</TableHead>
                    <TableHead>Ending Balance</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemsToShow.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {viewMode === 'yearly' ? (
                    <>
                      <TableCell className="font-medium">{(item as YearlyScheduleItem).year}</TableCell>
                      <TableCell>{formatCurrency((item as YearlyScheduleItem).beginningBalance, currency)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency((item as YearlyScheduleItem).totalPrincipal, currency)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency((item as YearlyScheduleItem).totalInterest, currency)}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency((item as YearlyScheduleItem).totalAdditional, currency)}</TableCell>
                      <TableCell>{formatCurrency((item as YearlyScheduleItem).endingBalance, currency)}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{(item as PaymentScheduleItem).month}</TableCell>
                      <TableCell>{formatCurrency((item as PaymentScheduleItem).beginningBalance, currency)}</TableCell>
                      <TableCell>{formatCurrency((item as PaymentScheduleItem).monthlyPayment, currency)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency((item as PaymentScheduleItem).principalPayment, currency)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency((item as PaymentScheduleItem).interestPayment, currency)}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency((item as PaymentScheduleItem).additionalPayment, currency)}</TableCell>
                      <TableCell>{formatCurrency((item as PaymentScheduleItem).endingBalance, currency)}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {displayData.length > 5 && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="link"
              onClick={() => setShowAll(!showAll)}
              className="text-primary hover:text-primary/80"
            >
              <ChevronDown className={`mr-1 transition-transform ${showAll ? 'rotate-180' : ''}`} size={16} />
              {showAll ? 'Show Less' : `Show All ${displayData.length} ${viewMode === 'yearly' ? 'Years' : 'Months'}`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
