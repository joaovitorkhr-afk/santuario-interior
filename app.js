'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector) => document.querySelector(selector);

    // Menu responsivo: só ativa se o botão existir no HTML.
    const menuToggle = $('#menu-toggle');
    const mainNav = $('#main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const open = mainNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(open));
        });

        mainNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Mantras
    const mantras = [
        'Eu permito que a calma encontre espaço dentro de mim.',
        'Eu posso recomeçar quantas vezes forem necessárias.',
        'Meu valor não depende da aprovação de outras pessoas.',
        'Eu acolho meus sentimentos sem precisar me julgar.',
        'Hoje, escolho dar um passo de cada vez.',
        'Eu mereço descanso, cuidado e gentileza.',
        'Posso mudar o que está ao meu alcance e soltar o que não controlo.',
        'A minha jornada não precisa seguir o ritmo de ninguém.'
    ];

    let currentMantra = mantras[0];

    $('#new-mantra')?.addEventListener('click', () => {
        const choices = mantras.filter((item) => item !== currentMantra);
        currentMantra = choices[Math.floor(Math.random() * choices.length)];

        $('#mantra-text').textContent = currentMantra;
        $('#mantra-status').textContent = '';
    });

    $('#copy-mantra')?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(currentMantra);
            $('#mantra-status').textContent = 'Mantra copiado.';
        } catch {
            $('#mantra-status').textContent =
                'Não foi possível copiar automaticamente. Selecione o texto para copiar.';
        }
    });

    // Meditação com temporizador.
    let selectedMinutes = 1;
    let remainingSeconds = 60;
    let timerInterval = null;
    let phaseTimeout = null;
    let meditating = false;

    const timer = $('#timer');
    const circle = $('#breathing-circle');
    const word = $('#breathing-word');
    const toggle = $('#meditation-toggle');
    const meditationStatus = $('#meditation-status');

    const formatTime = (seconds) => {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    function breathingPhase() {
        if (!meditating || !circle || !word) return;

        circle.classList.remove('breathing-out');
        circle.classList.add('breathing-in');
        word.textContent = 'Inspire';

        phaseTimeout = setTimeout(() => {
            if (!meditating) return;

            circle.classList.remove('breathing-in');
            circle.classList.add('breathing-out');
            word.textContent = 'Expire';

            phaseTimeout = setTimeout(breathingPhase, 4000);
        }, 4000);
    }

    function stopMeditation(completed = false) {
        meditating = false;
        clearInterval(timerInterval);
        clearTimeout(phaseTimeout);

        timerInterval = null;
        phaseTimeout = null;

        circle?.classList.remove('breathing-in', 'breathing-out');

        if (word) word.textContent = 'Respire';
        if (toggle) toggle.textContent = 'Começar meditação';

        if (meditationStatus) {
            meditationStatus.textContent = completed
                ? 'Meditação concluída. Observe como você está se sentindo.'
                : 'Pausa feita. Você pode recomeçar quando quiser.';
        }
    }

    document.querySelectorAll('.duration-button').forEach((button) => {
        button.addEventListener('click', () => {
            if (meditating) stopMeditation();

            document.querySelectorAll('.duration-button').forEach((item) => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });

            selectedMinutes = Number(button.dataset.minutes);
            remainingSeconds = selectedMinutes * 60;

            if (timer) timer.textContent = formatTime(remainingSeconds);

            if (meditationStatus) {
                meditationStatus.textContent =
                    'Duração selecionada. Comece quando estiver pronto.';
            }
        });
    });

    toggle?.addEventListener('click', () => {
        if (meditating) {
            stopMeditation();
            return;
        }

        meditating = true;
        remainingSeconds = selectedMinutes * 60;

        if (timer) timer.textContent = formatTime(remainingSeconds);
        toggle.textContent = 'Pausar meditação';

        if (meditationStatus) {
            meditationStatus.textContent =
                'Siga o ritmo da respiração, sem forçar.';
        }

        breathingPhase();

        timerInterval = setInterval(() => {
            remainingSeconds -= 1;

            if (timer) {
                timer.textContent = formatTime(Math.max(remainingSeconds, 0));
            }

            if (remainingSeconds <= 0) {
                stopMeditation(true);
            }
        }, 1000);
    });

    // Tarô reflexivo.
    const cards = [
        {
            name: 'O Sol',
            symbol: '☼',
            reading: 'Reconheça aquilo que já floresce na sua vida e celebre suas pequenas conquistas.'
        },
        {
            name: 'A Estrela',
            symbol: '✧',
            reading: 'Volte a nutrir aquilo que lhe traz esperança. Você não precisa resolver tudo hoje.'
        },
        {
            name: 'A Lua',
            symbol: '☾',
            reading: 'Nem tudo precisa estar claro agora. Dê tempo para que suas respostas amadureçam.'
        },
        {
            name: 'A Imperatriz',
            symbol: '❀',
            reading: 'Cuide do que deseja ver crescer: seus projetos, suas relações e você mesmo.'
        },
        {
            name: 'A Força',
            symbol: '♧',
            reading: 'Força também é agir com gentileza e encarar o que sente sem se julgar.'
        },
        {
            name: 'O Eremita',
            symbol: '☼',
            reading: 'Reserve um momento de silêncio para ouvir sua própria voz.'
        },
        {
            name: 'A Temperança',
            symbol: '⚖',
            reading: 'Procure equilíbrio em pequenos ajustes. Nem tudo precisa ser resolvido de uma vez.'
        },
        {
            name: 'O Mundo',
            symbol: '◎',
            reading: 'Reconheça o caminho que já percorreu. Encerrar um ciclo pode abrir espaço para o novo.'
        }
    ];

    let cardIndex = 0;

    $('#draw-card')?.addEventListener('click', () => {
        const choices = cards
            .map((_, index) => index)
            .filter((index) => index !== cardIndex);

        cardIndex = choices[Math.floor(Math.random() * choices.length)];

        const card = cards[cardIndex];

        $('#tarot-symbol').textContent = card.symbol;
        $('#tarot-name').textContent = card.name;
        $('#tarot-title').textContent = card.name;

        // O parágrafo da interpretação no HTML deve ter id="tarot-message".
        const message = $('#tarot-message');

        if (message) {
            message.textContent = card.reading;
        }
    });

    // Reflexões simbólicas dos signos.
    const zodiac = {
        aries: ['Áries', '♈', 'Sua coragem pode abrir caminhos, mas respeite seu próprio tempo.'],
        touro: ['Touro', '♉', 'Valorize o que oferece segurança e permita espaço para mudanças.'],
        gemeos: ['Gêmeos', '♊', 'Sua curiosidade é uma ponte. Escute com a mesma atenção com que deseja ser ouvido.'],
        cancer: ['Câncer', '♋', 'Acolha suas emoções e lembre-se de que cuidar de si também é importante.'],
        leao: ['Leão', '♌', 'Sua autenticidade tem valor, mesmo quando você não precisa provar nada.'],
        virgem: ['Virgem', '♍', 'Você não precisa aperfeiçoar tudo para merecer descanso.'],
        libra: ['Libra', '♎', 'Busque harmonia sem abandonar suas próprias necessidades.'],
        escorpiao: ['Escorpião', '♏', 'Dê nome ao que sente e escolha o que deseja levar adiante.'],
        sagitario: ['Sagitário', '♐', 'Explore o novo sem se desconectar de si mesmo.'],
        capricornio: ['Capricórnio', '♑', 'Reconheça cada pequeno avanço no caminho até seus objetivos.'],
        aquario: ['Aquário', '♒', 'Permita-se pertencer sem esconder sua individualidade.'],
        peixes: ['Peixes', '♓', 'Proteja sua energia e mantenha os pés no presente.']
    };

    $('#zodiac-select')?.addEventListener('change', (event) => {
        const [name, symbol, reading] = zodiac[event.target.value];

        $('#zodiac-title').textContent = name;
        $('#zodiac-symbol').textContent = symbol;
        $('#zodiac-reading').textContent = reading;
    });

    // Diário: salvar, editar e excluir usando o armazenamento local.
    const storageKey = 'santuarioInteriorEntriesV1';

    let entries = [];
    let editingId = null;

    const titleInput = $('#journal-title');
    const bodyInput = $('#journal-entry');
    const entryCount = $('#journal-count');
    const entryList = $('#saved-entries');
    const journalStatus = $('#journal-status');

    function loadEntries() {
        try {
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
            entries = Array.isArray(data) ? data : [];
        } catch {
            entries = [];
        }
    }

    function persistEntries() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(entries));
            return true;
        } catch {
            if (journalStatus) {
                journalStatus.textContent =
                    'Não foi possível salvar. Verifique o armazenamento do navegador.';
            }

            return false;
        }
    }

    function updateCount() {
        if (entryCount && bodyInput) {
            entryCount.textContent = `${bodyInput.value.length}/5000`;
        }
    }

    function resetForm() {
        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';

        editingId = null;

        const saveButton = $('#save-entry');

        if (saveButton) {
            saveButton.textContent = 'Salvar anotação';
        }

        updateCount();
    }

    function renderEntries() {
        if (!entryList) return;

        entryList.replaceChildren();

        if (entries.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-state';
            empty.textContent = 'Suas anotações salvas aparecerão aqui.';
            entryList.appendChild(empty);
            return;
        }

        [...entries]
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .forEach((entry) => {
                const article = document.createElement('article');
                article.className = 'entry-item';

                const heading = document.createElement('h4');
                heading.textContent = entry.title || 'Anotação sem título';

                const body = document.createElement('p');
                body.textContent = entry.body;

                const date = document.createElement('p');
                date.textContent = new Date(entry.updatedAt).toLocaleString('pt-BR');

                const actions = document.createElement('div');
                actions.className = 'entry-actions';

                const edit = document.createElement('button');
                edit.type = 'button';
                edit.textContent = 'Editar';

                edit.addEventListener('click', () => {
                    titleInput.value = entry.title;
                    bodyInput.value = entry.body;
                    editingId = entry.id;

                    $('#save-entry').textContent = 'Atualizar anotação';

                    journalStatus.textContent =
                        'Editando anotação. Faça as alterações e salve.';

                    updateCount();
                    titleInput.focus();
                });

                const remove = document.createElement('button');
                remove.type = 'button';
                remove.textContent = 'Excluir';

                remove.addEventListener('click', () => {
                    if (!window.confirm('Deseja excluir esta anotação?')) {
                        return;
                    }

                    entries = entries.filter((item) => item.id !== entry.id);

                    if (persistEntries()) {
                        renderEntries();
                        journalStatus.textContent = 'Anotação excluída.';

                        if (editingId === entry.id) {
                            resetForm();
                        }
                    }
                });

                actions.append(edit, remove);
                article.append(heading, body, date, actions);
                entryList.appendChild(article);
            });
    }

    bodyInput?.addEventListener('input', updateCount);

    $('#save-entry')?.addEventListener('click', () => {
        const body = bodyInput.value.trim();
        const title = titleInput.value.trim();

        if (!body) {
            journalStatus.textContent =
                'Escreva algo antes de salvar sua anotação.';

            bodyInput.focus();
            return;
        }

        const now = Date.now();

        if (editingId) {
            entries = entries.map((entry) =>
                entry.id === editingId
                    ? { ...entry, title, body, updatedAt: now }
                    : entry
            );
        } else {
            entries.push({
                id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
                title,
                body,
                updatedAt: now
            });
        }

        if (persistEntries()) {
            resetForm();
            renderEntries();
            journalStatus.textContent =
                'Sua anotação foi salva neste navegador.';
        }
    });

    loadEntries();
    renderEntries();
    updateCount();
});