export class User {
  id: string;
  name: string;
  isActive: boolean;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.isActive = true;
  }

  setActive() {
    this.isActive = true;
  }

  setInactive() {
    this.isActive = false;
  }
}
