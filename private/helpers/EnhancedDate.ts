/*
 * Copyright 2023 Marek Kobida
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

  moveLeft() {
    if (this.getMonth() === 0) {
      this.setFullYear(this.getFullYear() - 1);
      this.setMonth(11);
    } else {
      this.addMonths(-1);
    }
  }

  moveRight() {
    if (this.getMonth() === 11) {
      this.setFullYear(this.getFullYear() + 1);
      this.setMonth(0);
    } else {
      this.addMonths(1);
    }
  }
}

export default EnhancedDate;
