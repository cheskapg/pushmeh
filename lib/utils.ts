import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function formatDate(dateString: string | null) {
  if (!dateString) {
    return ""; // or you can return a default value like 'N/A'
  }
  const date = DateTime.fromISO(dateString);
  return date.toFormat("MM / dd / yyyy");
}

export function formatTime(timeString: string | null) {
  if (!timeString) {
    return ""; // or you can return a default value like 'N/A'
  }
  const time = DateTime.fromFormat(timeString, "HH:mm");
  return time.toFormat("h:mm a");
}

export const formatTableTime = (timeString: any) => {
  const now = new Date();
  const [hours, minutes] = timeString.toString().split(':').map(Number);

  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  const formattedTime = date.toLocaleTimeString('en-US',{
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedTimeWithoutSpace = formattedTime.replace(/([\d]+:[\d]+)\s([aApP][mM])/, '$1$2');

  return formattedTimeWithoutSpace.toLowerCase();
};

export const formatCreatedTime = (dateTimeString: string) => {
  // Parse the date-time string into a Date object
  const date = new Date(dateTimeString);


  // Format the time to the desired format
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Remove the space between the time and the AM/PM marker and convert to lowercase
  const formattedTimeWithoutSpace = formattedTime.replace(/([\d]+:[\d]+)\s([aApP][mM])/, '$1$2').toLowerCase();

  return formattedTimeWithoutSpace;
};

// Example usage
const dateTimeString = '2024-05-02T23:34:32.957Z';
const formattedTime = formatCreatedTime(dateTimeString);
console.log(formattedTime); // Output: "7:00am"


export function formatTableDate(dateString: string | number | Date): string {
  // Create a new Date object from the provided date
  const date = new Date(dateString);

  // Get the month, day, and year
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date
  const formattedDate = `${month} ${day}, ${year}`;
  
  return formattedDate;
};


export async function downloadPdf(jsonFile: any, props: any, variant: string) {
  const doc = new jsPDF();

  const columns = props.map((prop: any) => ({ header: prop, dataKey: prop }));
  const data = jsonFile.map((row: any) => {
    let newRow: any = {};
    props.forEach((prop: any) => {
      newRow[prop] = row[prop];
    });
    return newRow;
  });

  const tableData = data.map((row: any) => {
    return columns.map((column: string) => {
      return row[column];
    });
  });

  autoTable(doc, {
    head: [columns.map((col: { header: any }) => col.header)],
    body: data.map((row: { [x: string]: any }) =>
      columns.map((col: { dataKey: string | number }) => row[col.dataKey]),
    ),
  });

  // Save the PDF
  doc.save(`${variant}.pdf`);
}
