import bcrypt from 'bcrypt';

class BcryptService {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  };

  public async passwordHash(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (error) {
      throw new Error("Error ao criptografar a senha");
    };
  };

  public async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    try {
      const match = await bcrypt.compare(password, hashPassword);
      return match;
    } catch (error) {
      throw new Error('Erro ao verificar a senha')
    }
  }
}

export default BcryptService;