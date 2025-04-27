// Script principal

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
 * Simula a validação do formulário
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
        ],
        experience: [
            'Este número de anos de experiência já foi utilizado por outro inscrito.',
            'Ano incorreto, tente novamente.',
        ],
        language: [
            'segmentation fault (core dumped)'
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
    const modalContent = document.querySelector('.modal-content');

    // Estado inicial - reset quando a página é carregada
    window.termsAttemptCount = 0;

    // Configurações
    const maxAttempts = 3;

    // Garantir que o modal esteja inicialmente oculto
    modal.style.display = 'none';

    // Mensagens de erro que ficam piores a cada tentativa
    const errorMessages = [
        'Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "termsOfService" is null',
        'CRITICAL ERROR: Buffer overflow in TermsOfService.dll - Stack corrupted at 0xB00BC4FE',
        'FATAL ERROR: Quantum decoherence detected in server array. Terms of Service collapsed into superposition.'
    ];

    const stackTraces = [
        `at com.theworstdev.terms.TermsService.loadTerms(TermsService.java:42)
at com.theworstdev.controllers.ModalController.showTerms(ModalController.java:31)
at com.theworstdev.ui.Modal.display(Modal.java:89)
at javascript.popup.onClick(unknown source)`,

        `[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.8.0:compile
[ERROR] COMPILATION ERROR: Unresolved compilation problems:
[ERROR] TermsOfService cannot be resolved to a type
[ERROR] Syntax error, insert ";" to complete BlockStatements`,

        `Kernel panic - not syncing: Attempted to kill the init process: exit code 0x0000000B
CPU: 2 PID: 1 Comm: systemd Not tainted 5.8.0-63-generic #71-Ubuntu
Stack Trace:
 dump_stack+0x74/0x92
 panic+0x114/0x2e8
 __lock_acquire+0x10a0/0x14e0`
    ];

    const errorCodes = ['500', '400', '418'];

    // Função para mostrar loading inicial quando o modal é aberto
    function showInitialLoading() {
        // Criar elemento de carregamento
        const loadingElement = document.createElement('div');
        loadingElement.className = 'initial-loading';

        // Adicionar spinner e texto
        loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Carregando termos de uso...</div>
        `;

        // Adicionar ao modal
        modalContent.appendChild(loadingElement);

        // Esconder o conteúdo principal do modal temporariamente
        const errorHeader = document.querySelector('.error-header');
        const errorBody = document.querySelector('.error-body');

        if (errorHeader) errorHeader.style.visibility = 'hidden';
        if (errorBody) errorBody.style.visibility = 'hidden';

        // Remover o carregamento após 1.5 segundos e mostrar o conteúdo
        setTimeout(() => {
            // Verificar se o elemento ainda existe (pode ter sido removido se o modal for fechado rapidamente)
            if (document.contains(loadingElement)) {
                // Remover com fade out
                loadingElement.style.opacity = '0';
                loadingElement.style.transition = 'opacity 0.3s';

                setTimeout(() => {
                    if (document.contains(loadingElement)) {
                        loadingElement.remove();

                        // Mostrar conteúdo
                        if (errorHeader) errorHeader.style.visibility = 'visible';
                        if (errorBody) errorBody.style.visibility = 'visible';
                    }
                }, 300);
            }
        }, 1500);
    }

    // Função para atualizar o erro exibido com base no estado atual
    function updateErrorMessages() {
        const state = window.termsAttemptCount;
        const errorDetails = document.querySelector('.error-details');
        const stackTrace = document.querySelector('.stack-trace');
        const errorCode = document.querySelector('.error-code');

        if (errorDetails && stackTrace && errorCode) {
            errorDetails.textContent = errorMessages[state];
            stackTrace.textContent = stackTraces[state];
            errorCode.textContent = errorCodes[state];
        }
    }

    // Função para mostrar o loading do botão "tentar novamente"
    function showRetryLoading() {
        // Capturar o corpo do erro
        const errorBody = document.querySelector('.error-body');

        // Guardar o conteúdo original
        const originalContent = errorBody.innerHTML;

        // Substituir com o indicador de carregamento
        errorBody.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px;">
                <div class="loading-spinner"></div>
                <div class="loading-text" style="margin-top: 15px;">Tentando reconectar ao servidor...</div>
            </div>
        `;

        // Retornar o conteúdo original para ser restaurado depois
        return originalContent;
    }

    // Função para aplicar os efeitos visuais do estado "travado" final
    function applyFinalErrorState() {
        // Revelar dica no console
        console.log("%c🧠 DICA SECRETA: Não existe termos de uso de verdade!", "color:red; font-size:20px; font-weight:bold");

        // Obter referências aos elementos
        const refreshButton = document.getElementById('refresh-terms');
        const headerTitle = document.querySelector('.error-header h2');

        // Desabilitar o botão
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Servidor não está respondendo';
        }

        // Adicionar efeitos visuais de travamento
        modalContent.classList.add('loading-cursor', 'modal-frozen');

        // Atualizar o título
        if (headerTitle) {
            const state = window.termsAttemptCount;
            headerTitle.innerHTML = `<span class="error-code">${errorCodes[state]}</span> Internal Server Error <span class="not-responding">(Não respondendo)</span>`;
        }

        // Configurar o fechamento automático após alguns segundos
        setTimeout(() => {
            // Simular mensagem de crash
            showErrorNotification("A janela de termos de uso parou de responder e será fechada");

            // Fechar o modal após a notificação
            setTimeout(() => {
                modal.style.display = 'none';
            }, 1000);
        }, 4000);
    }

    // Abrir modal de termos
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Exibir o modal
        modal.style.display = 'block';

        // Se não for o estado final, mostrar loading inicial
        if (window.termsAttemptCount < maxAttempts - 1) {
            showInitialLoading();
        }

        // Atualizar as mensagens de erro
        updateErrorMessages();

        // Se for o estado final, aplicar efeitos especiais
        if (window.termsAttemptCount >= maxAttempts - 1) {
            applyFinalErrorState();
        }

        console.log(`Modal de termos aberto - estado atual: ${window.termsAttemptCount}`);
    });

    // Botão de fechar
    closeBtn.addEventListener('click', () => {
        // 60% chance do botão fechar não funcionar
        if (Math.random() < 0.6) {
            showErrorNotification("Botão de fechar não está respondendo. Tente usar ESC.");
        } else {
            modal.style.display = 'none';
            // NÃO resetamos o contador ao fechar
        }
    });

    // Botão "Tentar novamente" - implementação mais simples e direta
    document.addEventListener('click', function (e) {
        // Verificar se o clique foi no botão "Tentar novamente"
        if (e.target && e.target.id === 'refresh-terms') {
            const currentState = window.termsAttemptCount;

            // Se já estiver no estado final, não fazer nada
            if (currentState >= maxAttempts - 1) {
                console.log("Estado final, ignorando clique");
                return;
            }

            console.log(`Clique em Tentar Novamente - Estado atual: ${currentState}`);

            // Desabilitar o botão
            e.target.disabled = true;
            e.target.textContent = 'Conectando...';

            // Mostrar loading
            const originalContent = showRetryLoading();

            // Após 2 segundos, avançar para o próximo estado
            setTimeout(function () {
                // Atualizar o estado global
                window.termsAttemptCount++;

                console.log(`Avançando para estado: ${window.termsAttemptCount}`);

                // Obter referência ao corpo do erro
                const errorBody = document.querySelector('.error-body');

                // Restaurar o conteúdo original
                errorBody.innerHTML = originalContent;

                // Obter novas referências
                const refreshBtn = document.getElementById('refresh-terms');

                // Se for o estado final
                if (window.termsAttemptCount >= maxAttempts - 1) {
                    // Atualizar mensagens de erro
                    updateErrorMessages();

                    // Aplicar efeitos do estado final
                    applyFinalErrorState();
                } else {
                    // Restaurar o botão para estados não-finais
                    if (refreshBtn) {
                        refreshBtn.disabled = false;
                        refreshBtn.textContent = 'Tentar novamente';
                    }

                    // Atualizar mensagens de erro
                    updateErrorMessages();
                }
            }, 2000);
        }
    });

    // Fechar o modal se clicar fora do conteúdo
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            // NÃO resetamos o contador ao fechar
        }
    });

    // Fechar com ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            // NÃO resetamos o contador ao fechar
        }
    });

    // Adicionar um listener para reset quando a página for recarregada
    window.addEventListener('beforeunload', () => {
        window.termsAttemptCount = 0;
    });
}

/**
 * Mostra uma notificação de erro flutuante
 */
function showErrorNotification(message) {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 