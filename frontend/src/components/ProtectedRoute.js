import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Componente que protege rotas autenticadas
 * Redireciona para login se não estiver autenticado
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, token, user } = useAuth();

    // Aguarda enquanto verifica o token (loading) ou enquanto existe um
    // token salvo mas o usuário ainda não foi carregado (evita redirect
    // prematuro para /login no primeiro render).
    if (loading || (token && !user)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
