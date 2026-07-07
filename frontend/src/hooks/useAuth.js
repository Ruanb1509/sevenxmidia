import { useState, useCallback, useEffect } from 'react';

/* ============================================================== */
/* MODO TESTE — qualquer email/senha loga com um usuário VIP fake */
/* Mude para false (ou remova o bloco) antes de fazer deploy!     */
/* ============================================================== */
const MOCK_AUTH = false; // true = login fake p/ teste local

const MOCK_USER = {
    id: 'mock-user-1',
    name: 'Test Publisher',
    email: 'test@sevenxmedia.io',
    isVip: true,
    createdAt: '2025-06-01T00:00:00.000Z',
};

const useAuth = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    // Em modo mock, inicializa o usuário de forma SÍNCRONA para que rotas
    // protegidas não redirecionem antes do useEffect rodar.
    const [user, setUser] = useState(
        MOCK_AUTH && localStorage.getItem('authToken') === 'mock-token' ? MOCK_USER : null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

    // Verificar token ao montar o componente
    useEffect(() => {
        if (token) {
            verifyToken();
        }
    }, []);

    const verifyToken = useCallback(async () => {
        if (!token) return;

        if (MOCK_AUTH && token === 'mock-token') {
            setUser(MOCK_USER);
            setError(null);
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Token inválido');
            }

            const data = await response.json();
            setUser(data.user);
            setError(null);
        } catch (err) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('authToken');
            setError('Sessão expirada. Faça login novamente.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const register = useCallback(async (name, email, password, confirmPassword) => {
        setLoading(true);
        setError(null);

        if (MOCK_AUTH) {
            const mockUser = { ...MOCK_USER, name: name || MOCK_USER.name, email: email || MOCK_USER.email };
            setToken('mock-token');
            setUser(mockUser);
            localStorage.setItem('authToken', 'mock-token');
            setLoading(false);
            return { success: true, user: mockUser };
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao registrar');
            }

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            setError(null);

            return { success: true, user: data.user };
        } catch (err) {
            const errorMessage = err.message || 'Erro ao registrar';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);

        if (MOCK_AUTH) {
            const mockUser = { ...MOCK_USER, email: email || MOCK_USER.email };
            setToken('mock-token');
            setUser(mockUser);
            localStorage.setItem('authToken', 'mock-token');
            setLoading(false);
            return { success: true, user: mockUser };
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            setError(null);

            return { success: true, user: data.user };
        } catch (err) {
            const errorMessage = err.message || 'Erro ao fazer login';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setError(null);
        localStorage.removeItem('authToken');
    }, []);

    const refreshToken = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao renovar token');
            }

            const data = await response.json();
            setToken(data.token);
            localStorage.setItem('authToken', data.token);

            return { success: true };
        } catch (err) {
            logout();
            return { success: false, error: err.message };
        }
    }, [token]);

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token && !!user,
        register,
        login,
        logout,
        refreshToken,
        verifyToken
    };
};

export default useAuth;
