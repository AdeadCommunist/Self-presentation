document.addEventListener('DOMContentLoaded', function () {
    const animatedCards = document.querySelectorAll('.animated-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedCards.forEach(card => {
        card.style.animation = 'fadeInUp 0.8s forwards';
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const animationCanvas = document.getElementById('animationCanvas');

    function switchTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.style.animation = 'none';
            pane.style.opacity = '0';
        });

        document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
        const activePane = document.getElementById(tabId);
        activePane.classList.add('active');

        runTabAnimation(tabId, activePane);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    function runTabAnimation(tabId, activePane) {
        animationCanvas.innerHTML = '';
        animationCanvas.classList.add('active');
        animationCanvas.classList.remove('fade-out');

        const canvas = document.createElement('canvas');
        canvas.width = animationCanvas.clientWidth;
        canvas.height = animationCanvas.clientHeight;
        animationCanvas.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let animationType;
        switch(tabId) {
            case 'goal':
                animationType = 'confetti';
                break;
            case 'education':
                animationType = 'bubbles';
                break;
            case 'languages':
                animationType = 'stars';
                break;
            case 'qualities':
                animationType = 'pacman';
                break;
            case 'skills':
                animationType = 'snake';
                break;
            default:
                animationType = 'confetti';
        }

        let animationFunction;
        if (animationType === 'pacman') {
            animationFunction = () => runPacmanAnimation(ctx, canvas);
        } else if (animationType === 'snake') {
            animationFunction = () => runSnakeAnimation(ctx, canvas);
        } else if (animationType === 'confetti') {
            animationFunction = () => runConfettiAnimation(ctx, canvas);
        } else if (animationType === 'bubbles') {
            animationFunction = () => runBubblesAnimation(ctx, canvas);
        } else if (animationType === 'stars') {
            animationFunction = () => runStarsAnimation(ctx, canvas);
        }

        animationFunction();

        setTimeout(() => {
            animationCanvas.classList.add('fade-out');
            setTimeout(() => {
                animationCanvas.classList.remove('active');
                animationCanvas.classList.remove('fade-out');
                activePane.style.animation = 'fadeInContent 0.8s ease-out forwards';
            }, 1000);
        }, 3000);
    }

    function runPacmanAnimation(ctx, canvas) {
        let pacmanX = -30;
        const pacmanY = canvas.height / 2;
        let pacmanAngle = 0.2;
        let pacmanDirection = 1;

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(pacmanX, pacmanY, 20, pacmanAngle, Math.PI * 2 - pacmanAngle);
            ctx.lineTo(pacmanX, pacmanY);
            ctx.closePath();
            ctx.fillStyle = "#FFCC00";
            ctx.fill();

            pacmanAngle += 0.05 * pacmanDirection;
            if (pacmanAngle > 0.4 || pacmanAngle < 0.05) {
                pacmanDirection *= -1;
            }

            pacmanX += 3;
            if (pacmanX < canvas.width + 30) {
                requestAnimationFrame(draw);
            }
        }
        draw();
    }

    function runSnakeAnimation(ctx, canvas) {
        let snake = [];
        const snakeSize = 10;
        let snakeDirection = { x: 2, y: 0 };

        function init() {
            snake = [];
            for (let i = 4; i >= 0; i--) {
                snake.push({ x: i * snakeSize, y: canvas.height / 2 });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? "#4DCCBD" : "#3498db";
                ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
                ctx.strokeStyle = "#000";
                ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize);
            });

            const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };

            if (head.x >= canvas.width) head.x = 0;
            if (head.x < 0) head.x = canvas.width - snakeSize;
            if (head.y >= canvas.height) head.y = 0;
            if (head.y < 0) head.y = canvas.height - snakeSize;

            snake.unshift(head);
            snake.pop();

            if (Math.random() < 0.02) {
                snakeDirection = { x: snakeDirection.y, y: -snakeDirection.x };
            }

            requestAnimationFrame(draw);
        }

        init();
        draw();
    }

    function runConfettiAnimation(ctx, canvas) {
        const confettiCount = 100;
        const confetti = [];

        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height,
                size: Math.random() * 10 + 5,
                speed: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 5 - 2.5
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let stillFalling = false;

            confetti.forEach(c => {
                c.y += c.speed;
                c.rotation += c.rotationSpeed;

                if (c.y < canvas.height + 20) {
                    stillFalling = true;
                }

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.rotation * Math.PI / 180);
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
                ctx.restore();
            });

            if (stillFalling) {
                requestAnimationFrame(draw);
            }
        }
        draw();
    }

    function runBubblesAnimation(ctx, canvas) {
        const bubbles = [];
        const bubbleCount = 30;

        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 100,
                radius: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                color: `rgba(77, 204, 189, ${Math.random() * 0.5 + 0.3})`
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let stillRising = false;

            bubbles.forEach(bubble => {
                bubble.y -= bubble.speed;

                if (bubble.y > -20) {
                    stillRising = true;
                }

                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.strokeStyle = bubble.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            if (stillRising) {
                requestAnimationFrame(draw);
            }
        }
        draw();
    }

    function runStarsAnimation(ctx, canvas) {
        const stars = [];
        const starCount = 50;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                opacity: Math.random(),
                speed: Math.random() * 0.02 + 0.005,
                twinkleSpeed: Math.random() * 0.05 + 0.01
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.twinkleSpeed *= -1;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }
        draw();
    }

});