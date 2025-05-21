export const useAuth = () => {
    const isAuthenticated = !!localStorage.getItem("adminToken");
  
    const logout = () => {
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    };
  
    return { isAuthenticated, logout };
  };  