const authSchemas = {
  AuthUser: {
    type: "object",
    required: ["id", "nome", "email"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      nome: {
        type: "string",
        maxLength: 120,
        example: "climba",
      },
      email: {
        type: "string",
        format: "email",
        maxLength: 160,
        example: "acesso@email.com",
      },
    },
  },
  RegisterInput: {
    type: "object",
    required: ["nome", "email", "senha"],
    properties: {
      nome: {
        type: "string",
        minLength: 1,
        maxLength: 120,
        example: "climba",
      },
      email: {
        type: "string",
        format: "email",
        example: "acesso@email.com",
      },
      senha: {
        type: "string",
        minLength: 8,
        maxLength: 100,
        example: "useraAcessCl1",
      },
    },
  },
  LoginInput: {
    type: "object",
    required: ["email", "senha"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "acesso@email.com",
      },
      senha: {
        type: "string",
        minLength: 1,
        example: "useraAcessCl1",
      },
    },
  },
  AuthLoginResponse: {
    type: "object",
    required: ["token", "usuario"],
    properties: {
      token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      usuario: {
        $ref: "#/components/schemas/AuthUser",
      },
    },
  },
};

export { authSchemas };
