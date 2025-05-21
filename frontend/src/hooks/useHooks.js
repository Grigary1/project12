export const useAuth = () => {
    const isAuthenticated = !!localStorage.getItem("adminToken");
  
    const logout = () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    };
  
    return { isAuthenticated, logout };
  };  