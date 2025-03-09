import { SmsParser, SmsPattern, SmsParseResult } from './sms-parser';

describe('SmsParser (Karma + Jasmine)', () => {
  const patterns: SmsPattern[] = [
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

  let parser: SmsParser;

  beforeEach(() => {
    parser = new SmsParser(patterns);
  });

  it('should correctly extract values from ICICI Bank UPI SMS', () => {
    const sms = "ICICI Bank Acct XX033 debited for Rs 75.00 on 07-Mar-25, SHREESAMARTHCAT credited. UPI:506692430513.";
    const expectedResult: SmsParseResult = {
      source: 'ICICI',
      data: {
        Account: 'XX033',
        Amount: '75.00',
        Date: '07-Mar-25',
        Beneficiary: 'SHREESAMARTHCAT',
        TransactionID: '506692430513'
      }
    };

    const result = parser.parse(sms);
    expect(result).toEqual(expectedResult);
  });

  it('should correctly extract values from ICICI Bank card spend SMS', () => {
    const sms = "Rs 72,420.60 spent on ICICI Bank Card XX6000 on 08-Mar-25 at IND*Amazon - In. Avl Lmt: Rs 66,455.76. To dispute, call 18002662/SMS BLOCK 6000 to 9215676766. To convert this txn to EMI give a missed call on 9537667667. Know more about EMI conversion at icici.co/DUvfZI0QFMW";

    const expectedResult: SmsParseResult = {
      source: 'ICICI',
      data: {
        Amount: '72,420.60',
        Account: 'XX6000',
        Date: '08-Mar-25',
        Beneficiary: 'IND*Amazon - In'
      }
    };

    const result = parser.parse(sms);
    expect(result).toEqual(expectedResult);
  });

  it('should correctly extract values from HDFC Bank card spend SMS', () => {
    const sms = "Rs.163.21 spent on HDFC Bank Card x8914 at UBER INDIA SYSTE PVT L on 2025-01-31:17:32:29.Not U? To Block & Reissue Call 18002586161/SMS BLOCK CC 8914 to 7308080808";
  
    const expectedResult: SmsParseResult = {
      source: 'HDFC',
      data: {
        Amount: '163.21',
        Account: 'x8914',
        Beneficiary: 'UBER INDIA SYSTE PVT L',
        Date: '2025-01-31:17:32:29'
      }
    };
  
    const result = parser.parse(sms);
    expect(result).toEqual(expectedResult);
  });

  it('should correctly extract values from Axis Bank card spend SMS', () => {
    const sms = "Spent\nCard no. XX9876\nINR 13107\n19-02-25 08:38:34\nFLIPKART PA\nAvl Lmt INR 511333.9\nSMS BLOCK 9876 to 919951860002, if not you - Axis Bank";
  
    const expectedResult: SmsParseResult = {
      source: 'Axis',
      data: {
        Amount: '13107',
        Account: 'XX9876',
        Date: '19-02-25 08:38:34',
        Beneficiary: 'FLIPKART PA'
      }
    };
  
    const result = parser.parse(sms);
    expect(result).toEqual(expectedResult);
  });
  
  
  it('should return null for an unrecognized SMS', () => {
    const sms = "This is a random text message that does not match any pattern.";
    const result = parser.parse(sms);
    expect(result).toBeNull();
  });
});
