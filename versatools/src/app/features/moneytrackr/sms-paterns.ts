import { SmsPattern } from "src/app/sms-parser";

export const SMSParserPatterns: SmsPattern[] = [
    {
      source: 'ICICI',
      name: 'icici_upi',
      valueKeys: ["Account", "Amount", "Date", "Beneficiary", "TransactionID"],
      regex: /ICICI Bank Acct (?<Account>\w+) debited for Rs (?<Amount>[0-9,.]+) on (?<Date>\d{2}-\w{3}-\d{2}), (?<Beneficiary>.*?) credited\. UPI:(?<TransactionID>\d+)/
    },
    {
      source: 'ICICI',
      name: 'icici_creditcard',
      valueKeys: ["Account", "Amount", "Date", "Beneficiary"],
      regex: /Rs (?<Amount>[0-9,]+(?:\.\d{2})?) spent on ICICI Bank Card (?<Account>XX\d+) on (?<Date>\d{2}-\w{3}-\d{2}) at (?<Beneficiary>.+?)\./

    },
    {
      source: 'HDFC',
      name: 'hdfc_creditcard',
      valueKeys: ["Account", "Amount", "Date", "Beneficiary"],
      regex: /(?<Amount>\d+\.\d{2}) spent on HDFC Bank Card (?<Account>x\d+) at (?<Beneficiary>.+?) on (?<Date>\d{4}-\d{2}-\d{2}:\d{2}:\d{2}:\d{2})/

    },
    {
      source: 'Axis',
      name: 'axis_creditcard',
      valueKeys: ["Account", "Amount", "Date", "Beneficiary"],
      regex: /Spent\s+Card no\. (?<Account>XX\d+)\s+INR (?<Amount>\d+)\s+(?<Date>\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+(?<Beneficiary>.+?)\s+Avl Lmt/

    }
  ];