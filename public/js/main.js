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
    const acceptBtn = document.getElementById('accept-terms');
    const refreshBtn = document.getElementById('refresh-terms');
    const modalContent = document.querySelector('.modal-content');

    // Usar uma variável que persista entre aberturas do modal
    // Se não existir, inicializa com 0
    if (!window.termsAttemptCount) {
        window.termsAttemptCount = 0;
    }

    // Referência ao contador para facilitar a leitura
    let attemptCount = window.termsAttemptCount;
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

    // Função para atualizar o estado do modal com base no nível atual
    function updateModalState() {
        const errorDetails = document.querySelector('.error-details');
        const stackTrace = document.querySelector('.stack-trace');
        const errorCode = document.querySelector('.error-code');

        // Verificar se os elementos existem antes de atualizar
        if (errorDetails && stackTrace && errorCode) {
            // Atualizar a mensagem de erro e stack trace com base no attemptCount
            const index = Math.min(attemptCount, maxAttempts - 1);
            errorDetails.textContent = errorMessages[index];
            stackTrace.textContent = stackTraces[index];
            errorCode.textContent = errorCodes[index];

            // Se estiver no último nível (loading)
            if (attemptCount >= maxAttempts - 1) {
                // Desabilitar todos os botões
                document.querySelectorAll('#terms-modal button').forEach(btn => {
                    btn.disabled = true;
                });

                // Configurar o botão "Tentar novamente"
                if (refreshBtn) {
                    refreshBtn.disabled = true;
                    refreshBtn.textContent = 'Servidor não está respondendo';
                }

                // Adicionar efeito de cursor de loading
                modalContent.classList.add('loading-cursor', 'modal-frozen');

                // Atualizar o título com "Não respondendo"
                const headerTitle = document.querySelector('.error-header h2');
                if (headerTitle) {
                    headerTitle.innerHTML = `<span class="error-code">${errorCodes[index]}</span> Internal Server Error <span class="not-responding">(Não respondendo)</span>`;
                }
            }
        }
    }

    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';

        // Atualizar o estado do modal quando aberto
        updateModalState();

        console.log('Modal de termos aberto');
    });

    closeBtn.addEventListener('click', () => {
        // 60% chance do botão fechar não funcionar
        if (Math.random() < 0.6) {
            showErrorNotification("Botão de fechar não está respondendo. Tente usar ESC.");
        } else {
            modal.style.display = 'none';
            // NÃO resetamos o contador ao fechar
        }
    });

    acceptBtn.addEventListener('click', () => {
        // 50% de chance de não fechar o modal
        if (Math.random() > 0.5) {
            modal.style.display = 'none';
            // NÃO resetamos o contador ao fechar
        } else {
            // Mudar o texto do botão
            acceptBtn.textContent = 'Aceitando...';

            // Adicionar uma classe de erro no botão após vários cliques
            if (acceptBtn.dataset.clicks === undefined) {
                acceptBtn.dataset.clicks = 1;
            } else {
                acceptBtn.dataset.clicks = parseInt(acceptBtn.dataset.clicks) + 1;
                if (acceptBtn.dataset.clicks >= 3) {
                    acceptBtn.style.backgroundColor = '#888';
                    acceptBtn.disabled = true;
                    acceptBtn.textContent = 'Botão temporariamente indisponível';
                }
            }
        }
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Se já estiver no nível máximo, não fazer nada
            if (attemptCount >= maxAttempts - 1) return;

            // Incrementar o contador e atualizar a variável global
            attemptCount = Math.min(attemptCount + 1, maxAttempts - 1);
            window.termsAttemptCount = attemptCount;

            // Atualizar o estado do modal
            updateModalState();

            // Se for o último erro (terceira tentativa), simular o travamento
            if (attemptCount >= maxAttempts - 1) {
                // Revelar uma "pista" engraçada no console
                console.log("%c🧠 DICA SECRETA: Não existe termos de uso de verdade!", "color:red; font-size:20px; font-weight:bold");

                // Esperar alguns segundos e fechar o modal
                setTimeout(() => {
                    // Simular uma mensagem de crash antes de fechar
                    showErrorNotification("A janela de termos de uso parou de responder e será fechada");

                    // Fechar o modal após mostrar a notificação
                    setTimeout(() => {
                        modal.style.display = 'none';

                        // NÃO resetamos o contador nem removemos as classes
                    }, 1000);
                }, 4000);
            }
        });
    }

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