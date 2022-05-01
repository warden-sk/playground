/*
 * Copyright 2022 Marek Kobida
 */

class EnhancedDate extends Date {
  static DAYS: string[] = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];

  static MONTHS: string[] = [
    'januára',
    'februára',
    'marca',
    'apríla',
    'mája',
    'júna',
    'júla',
    'augusta',
    'septembra',
    'októbra',
    'novembra',
    'decembra',
  ];

  addMonths(months: number): this {
    this.setMonth(months < 0 ? this.getMonth() - -months : this.getMonth() + months);
    return this;
  }

  daysInMonth(month?: number): number {
    return new Date(
      this.getFullYear(),
      (month ? (month < 0 ? this.getMonth() - -month : this.getMonth() + month) : this.getMonth()) + 1,
      0
    ).getDate();
  }

  to(format: string): string {
    const day: string = EnhancedDate.DAYS[this.getDay()] ?? '';
    const month: string = EnhancedDate.MONTHS[this.getMonth()] ?? '';

    format = format
      .replace('mm', this.getMinutes().toString().padStart(2, '0'))
      .replace('YYYY', this.getFullYear().toString())
      .replace('MMMM', month)
      .replace('MM', this.getMonth().toString())
      .replace('HH', this.getHours().toString().padStart(2, '0'))
      .replace('DDDD', day)
      .replace('DD', this.getDate().toString().padStart(2, '0'))
      .replace('D', this.getDate().toString());

    return format;
  }
}

export default EnhancedDate;
