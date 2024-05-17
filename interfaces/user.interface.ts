interface User {
  id?: number,
  name: string,
  email: string,
  cpf: string,
  city: string,
  state: string,
  password_hash: string,
  avatarUrl?: string
}

export default User;