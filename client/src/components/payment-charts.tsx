import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from "@/lib/currency-utils";
import type { LoanResults, PaymentScheduleItem } from "@/lib/loan-calculations";

interface PaymentChartsProps {
  results: LoanResults;
  schedule: PaymentScheduleItem[];
  currency: string;
}

export default function PaymentCharts({ results, schedule, currency }: PaymentChartsProps) {
  // Prepare pie chart data
  const pieData = [
    { name: 'Principal', value: results.totalAmount - results.totalInterest, color: '#10b981' },
    { name: 'Interest', value: results.totalInterest, color: '#ef4444' }
  ];

  // Prepare line chart data (yearly)
  const lineData = schedule.reduce((acc: any[], payment, index) => {
    const year = Math.ceil((index + 1) / 12);
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear.balance = payment.endingBalance;
    } else {
      acc.push({
        year: year,
        balance: payment.endingBalance,
        name: `Year ${year}`
      });
    }
    
    return acc;
  }, []);

  const formatTooltipValue = (value: number) => formatCurrency(value, currency);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Remaining Balance Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fill="rgba(37, 99, 235, 0.1)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
