'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Select components removed
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'; // Removed ResponsiveContainer
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'; // Removed ChartTooltip
import { TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- Helper Functions for Formatting ---
const formatNumberWithApostrophe = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(String(value).replace(/[']/g, ''));
    if (isNaN(num)) return '';
    const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
    return formatted.replace(/,/g, "'");
};

// Removed unused parseFormattedNumber function
// const parseFormattedNumber = (value: string): number => { ... };

// --- Chart Config ---
const chartConfig = {
    principal: { label: "Principal", color: "hsl(217 91% 60%)" },
    interestAmount: { label: "Interest", color: "hsl(142 71% 45%)" },
    profitRatio: { label: "Profit Ratio" },
    balance: { label: "Total Balance" }
} as const;

// --- Component ---
export default function CompoundInterestCalculator() {
    // --- State Variables ---
    const [initialDeposit, setInitialDeposit] = useState<number>(5000);
    const [years, setYears] = useState<number>(10);
    const [rate, setRate] = useState<number>(7);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(200);
    // Compound frequency state removed
    const [displayInitialDeposit, setDisplayInitialDeposit] = useState<string>(formatNumberWithApostrophe(initialDeposit));
    const [displayMonthlyContribution, setDisplayMonthlyContribution] = useState<string>(formatNumberWithApostrophe(monthlyContribution));

    // --- Calculation Logic (Hardcoded Annual Compounding) ---
    const calculationResults = useMemo(() => {
        const P = Number(initialDeposit);
        const r = Number(rate) / 100; // Annual rate
        const t = Number(years);
        const M = Number(monthlyContribution);
        // const n = 1; // Variable n is unused, removed

        let currentBalance = P;
        let totalPrincipal = P;
        const breakdown = [{ year: 0, principal: P, balance: P, interestAmount: 0, profitRatio: 0, }];
        const totalMonths = t * 12;

        for (let month = 1; month <= totalMonths; month++) {
            // Add monthly contribution at the start of the month
            if (M > 0) { currentBalance += M; totalPrincipal += M; }

            // Apply annual interest ONLY at the end of the year (month % 12 === 0)
            if (month % 12 === 0) {
                 currentBalance += currentBalance * r; // Apply annual rate directly
            }

            // Record data at the end of each year
            if (month % 12 === 0) {
                const yearNum = month / 12;
                const roundedBalance = Math.round(currentBalance);
                const roundedPrincipal = Math.round(totalPrincipal);
                const interestAmount = Math.max(0, roundedBalance - roundedPrincipal);
                const profitRatio = roundedPrincipal > 0 ? (interestAmount / roundedPrincipal) : 0;
                breakdown.push({ year: yearNum, principal: roundedPrincipal, balance: roundedBalance, interestAmount: interestAmount, profitRatio: profitRatio, });
            }
        }
        const lastDataPoint = breakdown[breakdown.length - 1];
        const currentYear = new Date().getFullYear();
        const breakdownWithActualYears = breakdown.map(item => ({ ...item, year: currentYear + item.year, }));

        return {
            breakdown: breakdownWithActualYears,
            totalBalance: Math.round(lastDataPoint.balance),
            totalPrincipal: Math.round(lastDataPoint.principal),
            totalInterest: Math.round(lastDataPoint.interestAmount),
        };
    // Dependency array remains correct without compoundFrequency
    }, [initialDeposit, years, rate, monthlyContribution]);

    // --- Input Change Handlers ---
    const handleInitialDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const digits = rawValue.replace(/[^0-9]/g, '');
        const numericValue = digits === '' ? 0 : parseInt(digits, 10);
        setInitialDeposit(numericValue);
        setDisplayInitialDeposit(formatNumberWithApostrophe(numericValue));
    };
    const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const digits = rawValue.replace(/[^0-9]/g, '');
        const numericValue = digits === '' ? 0 : parseInt(digits, 10);
        setMonthlyContribution(numericValue);
        setDisplayMonthlyContribution(formatNumberWithApostrophe(numericValue));
    };

    // --- JSX Structure ---
    return (
        <div className="space-y-6">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Compound Interest Calculator</h1>
                <p className="text-muted-foreground">Estimate the future value of your investment (compounded annually).</p>
            </header>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-3">
                {/* Input Card */}
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label htmlFor="initialDeposit">Initial Deposit ($)</Label><Input id="initialDeposit" type="text" inputMode="numeric" value={displayInitialDeposit} onChange={handleInitialDepositChange} placeholder="e.g. 5'000" /></div>
                        <div><Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label><Input id="monthlyContribution" type="text" inputMode="numeric" value={displayMonthlyContribution} onChange={handleMonthlyContributionChange} placeholder="e.g. 200" /></div>
                        <div><Label htmlFor="years">Years of Growth</Label><Input id="years" type="number" value={years} onChange={(e) => setYears(Math.max(1, Number(e.target.value)))} min="1" /></div>
                        <div><Label htmlFor="rate">Rate of Return (Yearly %)</Label><Input id="rate" type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} step="0.1" /></div>
                        {/* Compound Frequency Select REMOVED */}
                    </CardContent>
                </Card>

                {/* Results & Chart Card */}
                <Card className="lg:col-span-6">
                    <CardHeader><CardTitle>Projected Growth</CardTitle><CardDescription>Estimated value after {years} years (compounded annually).</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        {/* Summary Totals */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div><p className="text-sm text-muted-foreground">Total Principal</p><p className="text-2xl font-bold">${formatNumberWithApostrophe(calculationResults.totalPrincipal)}</p></div>
                            <div><p className="text-sm text-muted-foreground">Total Interest</p><p className="text-2xl font-bold">${formatNumberWithApostrophe(calculationResults.totalInterest)}</p></div>
                            <div><p className="text-sm text-muted-foreground">End Balance</p><p className="text-2xl font-bold">${formatNumberWithApostrophe(calculationResults.totalBalance)}</p></div>
                        </div>
                        {/* Area Chart */}
                        <div className="h-80">
                             {/* Use ChartContainer for responsiveness */}
                            <ChartContainer config={chartConfig} className="w-full h-full">
                                <AreaChart data={calculationResults.breakdown} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                    <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                                    {/* Tooltip using ChartTooltipContent formatters */}
                                    <Tooltip
                                        cursor={true}
                                        content={
                                            <ChartTooltipContent
                                                indicator="dot"
                                                labelFormatter={(label, payload) => {
                                                    const dataPoint = payload?.[0]?.payload;
                                                    return dataPoint
                                                        ? `Year: ${label} | Balance: $${formatNumberWithApostrophe(dataPoint.balance)}`
                                                        : `Year: ${label}`;
                                                }}
                                                formatter={(value, name, props) => {
                                                    const dataPoint = props.payload;
                                                    if (!dataPoint) return null;
                                                    let content: React.ReactNode = null;
                                                    if (name === 'principal') { // Render details only once
                                                        content = (
                                                             <div className="space-y-1 !mt-2 text-sm w-full">
                                                                <div className="flex items-center justify-between">
                                                                    <span>Principal:</span>
                                                                    <span className="font-medium text-foreground">${formatNumberWithApostrophe(dataPoint.principal)}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span>Interest:</span>
                                                                    <span className="font-medium text-foreground">${formatNumberWithApostrophe(dataPoint.interestAmount)}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between pt-1 mt-1 border-t">
                                                                    <span>Profit Ratio:</span>
                                                                    <span className="font-medium text-foreground">{dataPoint.year === new Date().getFullYear() ? 'N/A' : dataPoint.profitRatio.toFixed(2)}</span>
                                                                </div>
                                                             </div>
                                                        );
                                                    }
                                                    return content;
                                                }}
                                                wrapperStyle={{ zIndex: 1000 }}
                                            />
                                        }
                                    />
                                    <defs>
                                        <linearGradient id="fillPrincipal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chartConfig.principal.color} stopOpacity={0.8}/><stop offset="95%" stopColor={chartConfig.principal.color} stopOpacity={0.1}/></linearGradient>
                                        <linearGradient id="fillInterest" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chartConfig.interestAmount.color} stopOpacity={0.8}/><stop offset="95%" stopColor={chartConfig.interestAmount.color} stopOpacity={0.1}/></linearGradient>
                                    </defs>
                                    <Area dataKey="principal" type="natural" fill="url(#fillPrincipal)" stroke={chartConfig.principal.color} strokeWidth={2} stackId="a" name="principal" />
                                    <Area dataKey="interestAmount" type="natural" fill="url(#fillInterest)" stroke={chartConfig.interestAmount.color} strokeWidth={2} stackId="a" name="interestAmount" />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-2 text-sm">
                        {/* Formula Description */}
                        <div className="flex w-full items-center justify-between text-muted-foreground pt-2 border-t mt-2">
                            <div>Showing projection from {calculationResults.breakdown[0]?.year} to {calculationResults.breakdown[calculationResults.breakdown.length - 1]?.year}</div>
                            <div className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Growth Trend</div>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Breakdown Table with Profit Ratio */}
            <Card>
                <CardHeader><CardTitle>Yearly Breakdown</CardTitle><CardDescription>Detailed growth and profit ratio year by year.</CardDescription></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Year</TableHead>
                                <TableHead>Principal</TableHead>
                                <TableHead>Interest (Cum.)</TableHead>
                                <TableHead>Profit Ratio</TableHead>
                                <TableHead className="text-right">Year-End Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {calculationResults.breakdown.map((item) => (
                                <TableRow key={item.year}>
                                    <TableCell className="font-medium">{item.year === new Date().getFullYear() ? "Start" : item.year}</TableCell>
                                    <TableCell>${formatNumberWithApostrophe(item.principal)}</TableCell>
                                    <TableCell>${formatNumberWithApostrophe(item.interestAmount)}</TableCell>
                                    <TableCell>{item.year === new Date().getFullYear() ? 'N/A' : item.profitRatio.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-semibold">${formatNumberWithApostrophe(item.balance)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}