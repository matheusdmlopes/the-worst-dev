document.addEventListener('DOMContentLoaded', () => {

    // Configurar os manipuladores de eventos do formulário
    setupFormHandlers();

    // Configurar o modal de termos
    setupTermsModal();

    // Inicializar a variável para rastrear o último campo com erro
    window.lastErrorField = null;

    // Contador de tentativas válidas de corrigir erros
    window.validAttempts = 0;

    // Estado dos valores anteriores dos campos
    window.previousFieldValues = {};

    // Flag para indicar se o usuário alterou o campo com erro
    window.hasChangedErrorField = false;

    // Rastreador dos campos que já tiveram erro neste ciclo
    window.usedErrorFields = [];

    // Debug: Adicionar um objeto global para rastrear a sequência de erros
    window.debugInfo = {
        errorSequence: [],
        cycleCount: 0
    };
});

/**
 * Configura os manipuladores de eventos do formulário
 */
function setupFormHandlers() {
    const form = document.getElementById('registration-form');
    const resetButton = document.getElementById('reset-button');

    // Adicionar listener para detectar mudanças nos campos de entrada
    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('change', (e) => {
            // Armazenar o valor atual para checar depois se foi alterado
            if (!window.previousFieldValues[field.id]) {
                window.previousFieldValues[field.id] = field.value;
            }

            // Se este for o campo com erro e o valor mudou, marcar que o usuário alterou o campo com erro
            if (window.lastErrorField === field.id && field.value !== window.previousFieldValues[field.id]) {
                window.hasChangedErrorField = true;
            }
        });

        // Também monitorar eventos de input para capturar mudanças em tempo real
        field.addEventListener('input', (e) => {
            // Se este for o campo com erro e o valor mudou, marcar que o usuário alterou o campo com erro
            if (window.lastErrorField === field.id && field.value !== window.previousFieldValues[field.id]) {
                window.hasChangedErrorField = true;
            }
        });
    });

    // Manipulador de evento para envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Armazenar a mensagem de erro atual do campo com erro antes de limpar
        let currentFieldErrorMessage = '';
        if (window.lastErrorField) {
            const errorElement = document.getElementById(`${window.lastErrorField}-error`);
            if (errorElement) {
                currentFieldErrorMessage = errorElement.textContent;
            }
        }

        // Limpar mensagens de erro gerais, mas não a do campo específico ainda
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');

        // Não limpar os erros dos campos individuais se o usuário não alterou o campo com erro
        if (window.lastErrorField && !window.hasChangedErrorField) {
            // Manter apenas o erro do campo atual, limpar os outros
            const allErrorElements = document.querySelectorAll('.field-error');
            allErrorElements.forEach(element => {
                if (element.id !== `${window.lastErrorField}-error`) {
                    element.textContent = '';
                }
            });
        } else {
            // Limpar todos os erros de campo
            clearFieldErrors();
        }

        // Mostrar um indicador visual de "processando" para dar a impressão de validação
        const submitButton = document.getElementById('submit-button');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processando...';
        }

        // Adicionar um pequeno delay para dar a impressão de que está validando
        setTimeout(() => {
            // Verificar se o usuário alterou o campo com erro anterior
            const didUserFixLastError = checkIfUserFixedLastError();

            // Se o usuário alterou o campo do último erro e preencheu todos os campos obrigatórios
            if (didUserFixLastError && areAllFieldsFilled()) {
                window.validAttempts++;

                // Se atingiu 9 tentativas, mostrar o easter egg de sucesso
                if (window.validAttempts >= 9) {
                    showSuccessModal();

                    // Restaurar o botão de envio
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Enviar Inscrição';
                    }
                    return;
                }

                // Quando o usuário corrigir um campo, removê-lo da lista de usados se estiver lá
                if (window.lastErrorField && window.usedErrorFields.includes(window.lastErrorField)) {
                    // Isso permite que o campo apareça novamente em um próximo ciclo
                    const index = window.usedErrorFields.indexOf(window.lastErrorField);
                    if (index > -1) {
                        window.usedErrorFields.splice(index, 1);
                    }
                }
            }

            // Se o usuário não alterou o campo com erro, manter o mesmo erro
            // Se não temos um campo de erro ou o usuário alterou o campo com erro, gerar um novo erro
            if (!window.lastErrorField || window.hasChangedErrorField) {
                // Simular validação - sempre encontra um erro
                validateForm();

                // Resetar o flag
                window.hasChangedErrorField = false;
            } else {
                // Manter o mesmo erro no campo específico
                const errorElement = document.getElementById(`${window.lastErrorField}-error`);
                if (errorElement && currentFieldErrorMessage) {
                    errorElement.textContent = currentFieldErrorMessage;
                }

                // Mostrar a mensagem de erro geral novamente
                showError(`Seu formulário contém 1 erro que precisa ser corrigido.`);
            }

            // Armazenar os valores atuais dos campos após a validação
            updatePreviousFieldValues();

            // Restaurar o botão de envio
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Inscrição';
            }
        }, Math.random() * 2000 + 2000);
    });

    // Manipulador para o botão de reset
    resetButton.addEventListener('click', (e) => {
        // 50% de chance de não limpar o formulário
        if (Math.random() > 0.5) {
            e.preventDefault();
            showError('Desculpe, o botão de limpar está temporariamente indisponível');
        } else {
            clearAllErrors();
            // Reset o último campo de erro e o flag
            window.lastErrorField = null;
            window.hasChangedErrorField = false;
            // Também resetar a lista de campos usados
            window.usedErrorFields = [];
        }
    });
}

/**
 * Verifica se o usuário alterou o campo que tinha erro anteriormente
 */
function checkIfUserFixedLastError() {
    if (!window.lastErrorField || !window.previousFieldValues[window.lastErrorField]) {
        return false;
    }

    const field = document.getElementById(window.lastErrorField);
    if (!field) return false;

    // Comparar o valor atual com o valor anterior
    return field.value !== window.previousFieldValues[window.lastErrorField];
}

/**
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function areAllFieldsFilled() {
    const requiredFields = document.querySelectorAll('[required]');
    for (const field of requiredFields) {
        if (!field.value) return false;

        // Verificação especial para checkbox
        if (field.type === 'checkbox' && !field.checked) return false;
    }
    return true;
}

/**
 * Atualiza o registro dos valores anteriores dos campos
 */
function updatePreviousFieldValues() {
    const fields = document.querySelectorAll('input, select');
    fields.forEach(field => {
        window.previousFieldValues[field.id] = field.value;
    });
}

/**
 * Limpa todos os campos do formulário
 */
function clearFormFields() {
    const form = document.getElementById('registration-form');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}

/**
 * Mostra o modal de sucesso (easter egg)
 */
function showSuccessModal() {
    // Limpar todos os campos do formulário
    clearFormFields();

    // Criar o modal de sucesso
    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.id = 'success-modal';
    successModal.style.display = 'block';

    // Conteúdo do modal
    successModal.innerHTML = `
        <div class="modal-content success-screen">
            <span class="close">&times;</span>
            <div class="success-header">
                <h2>🎉 Parabéns! 🎉</h2>
            </div>
            <div class="success-body">
                <div class="success-icon">✅</div>
                <p class="success-message-large">Sua inscrição foi enviada com sucesso!</p>
                <p class="success-details">Uau! Você conseguiu! Após 9 tentativas genuínas, provamos que você é realmente persistente.</p>
                <p class="success-details">Você acaba de encontrar o easter egg da página! Sua determinação é admirável.</p>
                <div class="success-actions">
                    <button id="close-success">Fechar</button>
                </div>
            </div>
        </div>
    `;

    // Adicionar ao DOM
    document.body.appendChild(successModal);

    // Configurar eventos do modal
    const closeBtn = successModal.querySelector('.close');
    const closeButton = successModal.querySelector('#close-success');

    // Função para fechar o modal
    const closeModal = () => {
        successModal.style.display = 'none';
        document.body.removeChild(successModal);

        // Reset do contador de tentativas para nova chance
        window.validAttempts = 0;
        window.lastErrorField = null;
        window.previousFieldValues = {};
        window.hasChangedErrorField = false;
        window.usedErrorFields = [];
        clearAllErrors();
    };

    // Configurar os eventos de fechar
    closeBtn.addEventListener('click', closeModal);
    closeButton.addEventListener('click', closeModal);

    // Fechar se clicar fora do modal
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });

    // Fechar com ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.style.display === 'block') {
            closeModal();
        }
    });
}

/**
 * Simula a validação do formulário - mostra apenas um erro por vez
 */
function validateForm() {
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
            'Ano(s) de experiência incorreto, tente novamente.',
        ],
        language: [
            'Esta linguagem já é a favorita de outro inscrito, por favor, escolha outra.',
        ]
        // Campo "terms" removido da lista de possíveis erros
    };

    // Obter todos os campos possíveis
    const allFields = Object.keys(errorMessages);

    // Verificar se TODOS os campos já foram usados
    const todosCamposUsados = window.usedErrorFields.length >= allFields.length;

    // Se todos os campos já foram usados, reiniciar o ciclo completamente
    if (todosCamposUsados) {
        console.log("Ciclo completo detectado! Todos os campos já tiveram erro.");
        window.debugInfo.cycleCount++;
        console.log(`Iniciando ciclo #${window.debugInfo.cycleCount}`);
        window.usedErrorFields = [];
    }

    // Filtrar campos que ainda não tiveram erro neste ciclo
    const availableFields = allFields.filter(field => !window.usedErrorFields.includes(field));

    // Verificar se ainda há campos disponíveis
    if (availableFields.length === 0) {
        console.error("Algo deu errado: não há campos disponíveis, mas o ciclo não foi reiniciado");
        // Medida de segurança: reiniciar ciclo se não houver campos disponíveis
        window.usedErrorFields = [];
        return validateForm();
    }

    // Escolher um campo aleatório disponível
    const randomIndex = Math.floor(Math.random() * availableFields.length);
    const selectedField = availableFields[randomIndex];

    // Escolher uma mensagem de erro aleatória para o campo selecionado
    const possibleErrors = errorMessages[selectedField];
    const randomError = possibleErrors[Math.floor(Math.random() * possibleErrors.length)];

    // Exibir o erro apenas neste campo
    const errorElement = document.getElementById(`${selectedField}-error`);
    if (errorElement) {
        errorElement.textContent = randomError;
    }

    // Adicionar este campo à lista de campos que já tiveram erro
    if (!window.usedErrorFields.includes(selectedField)) {
        window.usedErrorFields.push(selectedField);
    }

    // Atualizar log de debug
    window.debugInfo.errorSequence.push(selectedField);

    // Log detalhado
    console.log(`Campo selecionado: ${selectedField}`);
    console.log(`Campos já usados (${window.usedErrorFields.length}/${allFields.length}):`, JSON.stringify(window.usedErrorFields));

    // Atualizar o último campo com erro para a próxima validação
    window.lastErrorField = selectedField;

    // Mostrar mensagem geral de erro
    showError(`Seu formulário contém 1 erro que precisa ser corrigido.`);
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

    clearFieldErrors();
}

/**
 * Limpa apenas os erros dos campos individuais
 */
function clearFieldErrors() {
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
        }, 5000);
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
        console.log("%c🧠 DICA: Não existe termos de uso de verdade!", "color:red; font-size:20px; font-weight:bold");

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
        }, 6000);
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
                return;
            }

            // Desabilitar o botão
            e.target.disabled = true;
            e.target.textContent = 'Conectando...';

            // Mostrar loading
            const originalContent = showRetryLoading();

            // Após 2 segundos, avançar para o próximo estado
            setTimeout(function () {
                // Atualizar o estado global
                window.termsAttemptCount++;

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
            }, 5000);
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