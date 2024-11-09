class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.userGears = ["P", "N", "R", "D"];
    this.userGear = this.userGears[0];
  }
  shift(gear) {
    if (this.userGears.indexOf(gear) < 0)
      throw new Error(`Invalid gear: ${gear}`);
    this.userGear = gear;
  }
}
const car1 = new Car();
const car2 = new Car();
Car1.shift("N");
car1 instanceof Car; // true
car1 instanceof Array; // false
