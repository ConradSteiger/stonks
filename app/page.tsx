// app/page.tsx
import Link from "next/link";
import { TrendingUp, BarChart2, Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Stonks</h1>
        <p className="text-xl text-muted-foreground max-w-6xl">
            This platform provides a curated list of financial instruments for informational purposes only. 
            The data presented should not be considered financial advice. Always conduct your own research 
            or consult with a qualified financial advisor before making investment decisions.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="flex mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {/* Stocks Card */}
          <Card className="flex flex-col h-64 md:h-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Stocks
              </CardTitle>
              <CardDescription>
                Monitor individual company stocks.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Browse through our curated list of popular stocks across different sectors. 
                Access key identifiers like symbols and ISINs.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/stock" className="w-full">
                <Button className="w-full" variant="default">
                  View Stocks
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* ETFs Card */}
          <Card className="flex flex-col h-64 md:h-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                ETFs
              </CardTitle>
              <CardDescription>
                Explore Exchange-Traded Funds.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Discover ETFs that offer exposure to various sectors and markets.
                ETFs provide diversification while trading like stocks.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/etf" className="w-full">
                <Button className="w-full" variant="default">
                  View ETFs
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Calculator Card */}
          <Card className="flex flex-col h-64 md:h-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculator
              </CardTitle>
              <CardDescription>
                Plan your financial future.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Estimate the future value of your investments with different 
                scenarios. See how your money grows with regular contributions.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/calculator" className="w-full">
                <Button className="w-full" variant="default">
                  Use Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}