export const Login = async (email, password) => {
  if (email === "admin@schnitthub.com" && password === "admin123") {
    return {
      token: "fake-token-123",
        user: {
            id: 1,
            name: "Admin User",
            email,
        },
};
  }
    
throw new Error("E-mail ou senha inválidos");
  };