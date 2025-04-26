// Script principal para "The Worst Dev"

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicação inicializada');

    // Configurar os manipuladores de eventos do formulário
    setupFormHandlers();

    // Configurar o modal de termos
    setupTermsModal();
});

/**
 * Configura os manipuladores de eventos do formulário
 */
function setupFormHandlers() {
    const form = document.getElementById('registration-form');
    const resetButton = document.getElementById('reset-button');

    // Manipulador de evento para envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpar mensagens de erro anteriores
        clearAllErrors();

        // Simulação de validação - sempre encontra erros
        validateForm();
    });

    // Manipulador para o botão de reset
    resetButton.addEventListener('click', (e) => {
        // 50% de chance de não limpar o formulário
        if (Math.random() > 0.5) {
            e.preventDefault();
            showError('Desculpe, o botão de limpar está temporariamente indisponível');
        } else {
            clearAllErrors();
        }
    });
}

/**
 * Simula a validação do formulário - sempre encontra erros
 */
function validateForm() {
    let errorCount = 0;
    const errorMessages = {
        name: [
            'Já existe um inscrito com esse nome.',
            'Este nome já foi usado.',
            'Nome incorreto, tente novamente.',
        ],
        email: [
            'Emails com esta quantidade de caracteres estão temporariamente bloqueados.',
            'Não aceitamos emails com este domínio.',
        ],
        birthdate: [
            'Já existe um inscrito com esta data de nascimento.',
            'Esta data de nascimento já atingiu a cota máxima de inscrições.',
        ],
        experience: [
            'Este número de anos de experiência já foi utilizado.',
            'Não aceitamos mais candidatos com esta experiência.',
        ],
        language: [
            'Já atingimos o limite de programadores desta linguagem.'
        ],
        terms: [
            'Você precisa aceitar novamente os termos.'
        ]
    };

    // Gerar erros aleatórios
    Object.keys(errorMessages).forEach(field => {
        // 70% de chance de gerar um erro para cada campo
        if (Math.random() < 0.7) {
            const randomError = errorMessages[field][Math.floor(Math.random() * errorMessages[field].length)];

            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
                errorElement.textContent = randomError;
                errorCount++;
            }
        }
    });

    // Mostrar mensagem geral de erro
    if (errorCount > 0) {
        showError(`Seu formulário contém ${errorCount} erros que precisam ser corrigidos.`);
    } else {
        // Mesmo se não houver erros específicos, ainda encontramos algum motivo genérico
        showError('Não foi possível processar seu formulário devido a um erro inesperado. Tente novamente mais tarde.');
    }
}

/**
 * Exibe uma mensagem de erro geral
 */
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');

    // Scroll para o topo para mostrar o erro
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Limpa todas as mensagens de erro
 */
function clearAllErrors() {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = '';
    errorContainer.classList.add('hidden');

    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

/**
 * Configura o modal de termos
 */
function setupTermsModal() {
    const modal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link');
    const closeBtn = document.querySelector('.close');
    const acceptBtn = document.getElementById('accept-terms');

    // Garantir que o modal esteja inicialmente oculto
    modal.style.display = 'none';

    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        console.log('Modal de termos aberto');
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    acceptBtn.addEventListener('click', () => {
        // 50% de chance de não fechar o modal
        if (Math.random() > 0.5) {
            modal.style.display = 'none';
        } else {
            // Mudar o texto do botão
            acceptBtn.textContent = 'Tente novamente';
        }
    });

    // Fechar o modal se clicar fora do conteúdo
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
} 