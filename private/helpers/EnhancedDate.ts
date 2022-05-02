/*
 * Copyright 2022 Marek Kobida
 */

class EnhancedDate extends Date {
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
}

export default EnhancedDate;
