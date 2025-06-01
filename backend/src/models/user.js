export default class User {
  constructor(id, user_login, user_nicename, user_email, user_url, user_status, display_name) {
    this.id = id;
    this.user_login = user_login;
    this.user_nicename = user_nicename;
    this.user_email = user_email;
    this.user_url = user_url;
    this.user_status = user_status;
    this.display_name = display_name;
  }

  static async fetchAll(connection) {
    const rows = await connection`SELECT * FROM pw_users`;
    return rows;
  }

  static async findById(id, connection) {
    const rows = await connection`SELECT * FROM pw_users WHERE id=${id}`;
    return rows[0];
  }

  static async find(arg, connection) {
    console.log(arg);
    const allowedParams = ['user_email', 'username', 'id'];
    if (!allowedParams.includes(arg.param)) {
      throw new Error('Invalid query parameter');
    }

    const rows = await connection`SELECT * FROM pw_users WHERE ${connection(arg.param)} = ${
      arg.value
    } LIMIT 1`;

    if (rows.length === 0) {
      return [];
    }

    return rows[0];
  }
}
