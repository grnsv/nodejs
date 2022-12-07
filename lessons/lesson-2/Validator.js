class Validator {
  constructor(dates) {
    this.dates = dates;
    this.isValid = false;
  }

  validate() {
    this.dates = this.dates.map((date) => {
      const [hour, day, month, year] = date.split('-');
      const parsed = Date.parse(`${year}-${month}-${day}T${hour}:00:00.000+03:00`);
      if (!hour || !day || !month || !year || Number.isNaN(parsed)) {
        throw new Error('Date must be in format: HH-DD-MM-YYYY');
      }
      this.isValid = true;
      return new Date(parsed);
    });
  }

  validated() {
    return (this.isValid) ? this.dates : [];
  }
}

export default Validator;
