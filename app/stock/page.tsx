// app/stock/page.tsx
import { OverviewTable, ColumnDefinition } from "@/components/overview-table";
import { promises as fs } from 'fs'; // 'fs' allows reading files, 'promises' makes it work with async/await
import path from 'path';             // 'path' helps create file paths that work on any operating system

// Define the structure of a single stock item we expect from our JSON file
type StockItem = {
  currency: string;
  name: string;
  symbol: string;
  isin: string;
  tags: string[];
  links: { name: string; url: string }[];
};

// Define how each column in our table should look and behave
// This tells the OverviewTable component what data to show and how
const stockColumns: ColumnDefinition[] = [
  { key: "currency", header: "Currency", searchable: true },
  { key: "name", header: "Name", searchable: true },
  { key: "symbol", header: "Symbol", searchable: true, copyable: true }, // copyable adds a copy button
  { key: "isin", header: "ISIN", searchable: true, copyable: true },     // copyable adds a copy button
  { key: "tags", header: "Tags", rendererType: 'tags', searchable: true }, // 'tags' tells the table how to display an array of strings
  { key: "links", header: "Links", rendererType: 'links', searchable: true } // 'links' tells the table how to display an array of link objects
];

/**
 * Fetches stock data from the stocks.json file.
 * Uses async/await to handle reading the file asynchronously.
 */
async function getStockData(): Promise<StockItem[]> {
  // Construct the full path to the data file
  // process.cwd() gives the current working directory of the server
  const filePath = path.join(process.cwd(), 'data', 'stocks.json');
  console.log(`Attempting to read stock data from: ${filePath}`);

  try {
    // Read the file content as a string (using 'utf8' encoding)
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Parse the JSON string into a JavaScript array or object
    const data = JSON.parse(fileContents);

    // IMPORTANT: Make sure the data is actually an array, like we expect
    if (!Array.isArray(data)) {
      console.error(`Error: Data in ${filePath} is not an array.`);
      return []; // Return an empty array if the format is wrong
    }

    console.log(`Successfully loaded ${data.length} stock items.`);
    // Tell TypeScript that 'data' matches our StockItem array structure
    return data as StockItem[];

  } catch (error) {
    // If ANYTHING goes wrong in the 'try' block (file not found, invalid JSON, permissions error, etc.):
    console.error(`Failed to load stock data from ${filePath}:`, error); // Log the error for debugging
    // Return an empty array as a fallback. The page will still load but show no data.
    return [];
  }
}

/**
 * The main page component for displaying stocks.
 * It's an async component because it needs to 'await' the data fetching.
 */
export default async function StockPage() {
  // Fetch the stock data when the page loads
  // This will either be the array of stocks or an empty array if loading failed
  const stockData = await getStockData();

  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Added some padding for better spacing */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Stocks</h1>
        <p className="text-muted-foreground">Monitor and analyze your stock investments</p>
      </header>

      {/* Render the table component, passing the data and column definitions */}
      <OverviewTable
        initialData={stockData}
        columns={stockColumns}
        searchPlaceholder="Search stocks..."
      />

      <div className="text-sm text-muted-foreground">
        <p>Would you like to add an item? Please send it to stonks@conradsteiger.com</p>
        {/* Conditionally show a warning message if no data was loaded */}
        {stockData.length === 0 && (
             <p className="text-red-500 mt-2">Warning: Could not load stock data. Please check server logs.</p>
        )}
      </div>
    </div>
  );
}