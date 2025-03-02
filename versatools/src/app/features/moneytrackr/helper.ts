
export class Helper {

    public static PurposeList(): string[] {
        return ["Expense", "Income", "Investment", "Loan"];
    }

    public static YearList():string[]{
        return ["2024", "2023"];
    }

    public static MonthListForYear(year?: number): { index: number, month: string, value: string }[] {

        const today = new Date();
        const currentMonth = today.getMonth() + 1;

        const monthValuePairs: { index: number, month: string, value: string }[] = [];

        for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
            const monthDate = new Date(year || today.getFullYear(), monthIndex - 1, 1);
            const monthName = monthDate.toLocaleString('default', { month: 'long' });

            if (monthDate <= today) {
                const month = currentMonth === monthIndex ? 'This Month ' : monthName;
                monthValuePairs.push({ index: monthIndex, month: month, value: monthName });
            }
        }
        return monthValuePairs.sort((a, b) => a.index - b.index);
    }
 
    private constructor() {

    }
}