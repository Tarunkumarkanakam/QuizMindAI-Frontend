export const saveUserToLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
};

export const isAuthenticated = () => {
    return !!getUserFromLocalStorage();
};

export const deleteUser = async (token, userEmail) => {
    const response = await apiClient.delete(`/user/deleteUser`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { email: userEmail }
    });
    return response.data;
};



// Add the logoutUser function
export const logoutUser = (navigate) => {
    removeUserFromLocalStorage();
    if (navigate) {
        navigate('/home');
    }
};
