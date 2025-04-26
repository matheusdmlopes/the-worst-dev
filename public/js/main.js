// Script principal para "The Worst Dev"

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicação inicializada');

    // Verificar se o servidor está online
    checkServerStatus();
});

/**
 * Verifica se o servidor está funcionando
 */
async function checkServerStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        console.log('Status do servidor:', data);

        if (data.status === 'online') {
            console.log('Servidor está online e funcionando corretamente');
        } else {
            console.warn('Servidor pode estar com problemas');
        }
    } catch (error) {
        console.error('Erro ao verificar status do servidor:', error);
    }
}

// Outras funções serão implementadas na Fase 2 