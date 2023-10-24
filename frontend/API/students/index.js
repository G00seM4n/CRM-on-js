import domen from "../index.js";

class Students {
  constructor() {
    this.domen = domen;
  }

  async getAll() {
    const response = await fetch(`${this.domen}/api/students`, {
      method: 'GET',
    });

    return response.json();
  }

  async create(client) {
    const response = await fetch(`${this.domen}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(client),
    });

    return response.json();
  }

  async findOne(id) {
    const response = await fetch(`${this.domen}/api/students/${id}`, {
      method: 'GET',
    });

    return response.json();
  }

  async update(id, client) {
    const response = await fetch(`${this.domen}/api/students/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(client),
    });

    return response.json();
  }

  async delete(id) {
    const response = await fetch(`${this.domen}/api/students/${id}`, {
      method: 'DELETE',
    });

    return response.json();
  }
}

export default Students;
