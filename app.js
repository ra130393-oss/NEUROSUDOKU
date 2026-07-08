
<script>
        const audioPath = 'assets/audio/';
        const sounds = {
            success: new Audio(`${audioPath}sucesso.mp3`),
            error: new Audio(`${audioPath}erro.mp3`),
            click: new Audio(`${audioPath}click.mp3`),
            hint: new Audio(`${audioPath}dica.mp3`)
        };

        function playSound(type) {
            if(sounds[type]) {
                sounds[type].currentTime = 0;
                sounds[type].play().catch(() => {/* Evita erro se o usuário não interagiu ainda */});
            }
        }
    </script>

    <script>
        // Gabarito do Sudoku 4x4 estável e balanceado
        const solution = [
            1, 2, 3, 4,
            3, 4, 1, 2,
            2, 3, 4, 1,
            4, 1, 2, 3
        ];

        // Máscara inicial (0 representa campo vazio para preenchimento)
        const initialMap = [
            1, 0, 3, 0,
            0, 4, 0, 2,
            2, 0, 4, 0,
            0, 1, 0, 3
        ];

        function initGame() {
            playSound('click');
            const board = document.getElementById('sudoku-board');
            board.innerHTML = '';
            clearFeedback();

            initialMap.forEach((val, index) => {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = 1;
                input.max = 4;
                input.className = 'cell';
                input.setAttribute('data-index', index);
                input.setAttribute('inputmode', 'numeric'); // Abre teclado numérico no celular

                if (val !== 0) {
                    input.value = val;
                    input.classList.add('fixed');
                    input.disabled = true;
                } else {
                    input.value = '';
                }

                // Sanitização e validação em tempo real para facilitar o uso
                input.addEventListener('input', (e) => {
                    if (e.target.value.length > 1) e.target.value = e.target.value.slice(-1);
                    if (!['1','2','3','4'].includes(e.target.value)) e.target.value = '';
                });

                board.appendChild(input);
            });
        }

        function verifyGame() {
            const cells = document.querySelectorAll('.cell');
            let isComplete = true;
            let isCorrect = true;

            cells.forEach((cell, index) => {
                const val = parseInt(cell.value);
                if (isNaN(val)) {
                    isComplete = false;
                } else if (val !== solution[index]) {
                    isCorrect = false;
                }
            });

            const fb = document.getElementById('feedback-message');
            if (!isComplete) {
                fb.textContent = "Continue tentando! Ainda há espaços em branco. 🧠";
                fb.className = "feedback info";
                playSound('error');
            } else if (!isCorrect) {
                fb.textContent = "Alguns números não estão no lugar certo. Revise com calma! ✨";
                fb.className = "feedback error";
                playSound('error');
            } else {
                fb.textContent = "Parabéns! Excelente exercício para o seu cérebro! 🎉🏆";
                fb.className = "feedback success";
                playSound('success');
            }
        }

        function getHint() {
            playSound('hint');
            const cells = document.querySelectorAll('.cell:not(.fixed)');
            const emptyCells = Array.from(cells).filter(cell => cell.value === '');

            if (emptyCells.length === 0) {
                showTemporaryFeedback("A grade já está cheia! Verifique sua resposta. 😉", "info");
                return;
            }

            // Seleciona uma célula vazia aleatória e preenche com o valor correto
            const targetCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const idx = targetCell.getAttribute('data-index');
            
            targetCell.value = solution[idx];
            targetCell.style.animation = "pulse 0.5s alternate 2";
            
            showTemporaryFeedback("Uma pista foi adicionada com carinho! 💡", "info");
        }

        function showTemporaryFeedback(text, type) {
            const fb = document.getElementById('feedback-message');
            fb.textContent = text;
            fb.className = `feedback ${type}`;
        }

        function clearFeedback() {
            const fb = document.getElementById('feedback-message');
            fb.textContent = '';
            fb.className = 'feedback';
        }

        // Recursos de Acessibilidade
        function toggleTheme() {
            playSound('click');
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
            } else {
                body.setAttribute('data-theme', 'dark');
            }
        }

        function toggleTextSize() {
            playSound('click');
            document.body.classList.toggle('large-text');
        }

        // Inicia o app automaticamente ao carregar
        window.onload = initGame;
    </script>
