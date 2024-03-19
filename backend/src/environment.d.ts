declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: string;
    }
  }
}

export {};
