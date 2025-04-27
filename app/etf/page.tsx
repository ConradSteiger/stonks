// app/etf/page.tsx
import { OverviewTable, ColumnDefinition } from "@/components/overview-table";
import { promises as fs } from 'fs'; // 'fs' allows reading files, 'promises' makes it work with async/await
import path from 'path';             // 'path' helps create file paths that work on any operating system

// Define the structure of a single ETF item we expect from our JSON file
type EtfItem = {
  currency: string;
  name: string;
  symbol: string;
  isin: string;
  tags: string[];
  links: { name: string; url: string }[];
};

// Define how each column in our table should look and behave
// This tells the OverviewTable component what data to show and how
const etfColumns: ColumnDefinition[] = [
 { key: "currency", header: "Currency", searchable: true },
 { key: "name", header: "Name", searchable: true },
 { key: "symbol", header: "Symbol", searchable: true, copyable: true }, // copyable adds a copy button
 { key: "isin", header: "ISIN", searchable: true, copyable: true },     // copyable adds a copy button
 { key: "tags", header: "Tags", rendererType: 'tags', searchable: true }, // 'tags' tells the table how to display an array of strings
 { key: "links", header: "Links", rendererType: 'links', searchable: true } // 'links' tells the table how to display an array of link objects
];

/**
 * Fetches ETF data from the etf.json file.
 * Uses async/await to handle reading the file asynchronously.
 */
async function getEtfData(): Promise<EtfItem[]> {
  // Construct the full path to the data file
  // process.cwd() gives the current working directory of the server
  const filePath = path.join(process.cwd(), 'data', 'etf.json');
  console.log(`Attempting to read ETF data from: ${filePath}`);

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

    console.log(`Successfully loaded ${data.length} ETF items.`);
    // Tell TypeScript that 'data' matches our EtfItem array structure
    return data as EtfItem[];

  } catch (error) {
    // If ANYTHING goes wrong in the 'try' block (file not found, invalid JSON, permissions error, etc.):
    console.error(`Failed to load ETF data from ${filePath}:`, error); // Log the error for debugging
    // Return an empty array as a fallback. The page will still load but show no data.
    return [];
  }
}

/**
 * The main page component for displaying ETFs.
 * It's an async component because it needs to 'await' the data fetching.
 */
export default async function ETFPage() {
  // Fetch the ETF data when the page loads
  // This will either be the array of ETFs or an empty array if loading failed
  const etfData = await getEtfData();

  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Added some padding for better spacing */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">ETFs</h1>
        <p className="text-muted-foreground">Discover and track exchange-traded funds</p>
      </header>

      {/* Render the table component, passing the data and column definitions */}
      <OverviewTable
        initialData={etfData}
        columns={etfColumns}
        searchPlaceholder="Search ETFs..."
      />

      <div className="text-sm text-muted-foreground">
        <p>Would you like to add an item? Please send it to stonks@conradsteiger.com</p>
        {/* Conditionally show a warning message if no data was loaded */}
         {etfData.length === 0 && (
             <p className="text-red-500 mt-2">Warning: Could not load ETF data. Please check server logs.</p>
        )}
      </div>
    </div>
  );
}