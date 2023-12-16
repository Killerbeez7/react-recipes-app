import * as request from "./requester";

const baseUrl = "http://localhost:3030/users";

export const login = (email, password) =>
    request.post(`${baseUrl}/login`, { email, password });

export const logout = async (accessToken) => {
    try {
        const response = await fetch(`${baseUrl}/logout`, {
            headers: {
                "X-Authorization": accessToken,
            },
        });

        return response;
    } catch (error) {
        console.log(error);
    }
};

export const register = (username, email, password) =>
    request.post(`${baseUrl}/register`, { username, email, password });

// to fix edit user data
// export const editUserData = (userId, userData) => {
//     request.put(`${baseUrl}/${userId}`, userData);
// };
