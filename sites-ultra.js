/* ═══════════════════════════════════════════════════════════
   SITES PAGE - Enhanced Interactivity
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ── 1. Cursor glow following mouse ── */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        let gx = 0, gy = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', (e) => {
            gx = e.clientX;
            gy = e.clientY;
        });
        (function animateGlow() {
            cx += (gx - cx) * 0.12;
            cy += (gy - cy) * 0.12;
            cursorGlow.style.left = cx + 'px';
            cursorGlow.style.top = cy + 'px';
            requestAnimationFrame(animateGlow);
        })();
    }

    /* ── 2. Stagger reveal on scroll ── */
    const revealCards = document.querySelectorAll('.reveal-card');
    if (revealCards.length) {
        let revealDelay = 0;
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseFloat(el.dataset.revealDelay || 0);
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, delay);
                    revealObs.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealCards.forEach((card, i) => {
            // Only add stagger delay to initially visible cards
            if (!card.classList.contains('bento-item--extra')) {
                card.dataset.revealDelay = i * 80;
            } else {
                card.dataset.revealDelay = 0;
            }
            revealObs.observe(card);
        });
    }

    /* ── 3. Parallax for deco figures on scroll ── */
    const decoFigs = document.querySelectorAll('.deco-fig');
    const decoStars = document.querySelectorAll('.deco-star');
    if (decoFigs.length) {
        const speeds = [0.03, -0.025, 0.02, -0.035];
        let lastScroll = 0;
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            decoFigs.forEach((fig, i) => {
                const s = speeds[i % speeds.length];
                const y = scrollY * s;
                // Combine with existing animation - add translation
                fig.style.marginTop = y + 'px';
            });
            decoStars.forEach((star, i) => {
                const s = (i % 2 === 0 ? 0.015 : -0.02);
                star.style.marginTop = (scrollY * s) + 'px';
            });
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── 4. Load more button ── */
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const extraItems = document.querySelectorAll('.bento-item--extra');
    if (loadMoreBtn && extraItems.length) {
        let expanded = false;
        loadMoreBtn.addEventListener('click', () => {
            expanded = !expanded;
            extraItems.forEach((item, i) => {
                if (expanded) {
                    setTimeout(() => {
                        item.classList.add('show');
                        // Trigger reveal animation
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 50);
                    }, i * 100);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.classList.remove('show');
                    }, 400);
                }
            });
            loadMoreBtn.classList.toggle('expanded', expanded);
            loadMoreBtn.innerHTML = expanded
                ? 'Свернуть <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>'
                : 'Показать ещё <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
        });
    }

    /* ── 5. Card mouse glow (update CSS variables) ── */
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    /* ── 6. Mini chat preview on bot cards ── */
    const botCardMessages = {
        beauty: {
            emoji: '💅', color: '#FF6B9D',
            msgs: [
                { t: 'bot', m: 'Добро пожаловать в салон «Гламур»! 💅✨' },
                { t: 'bot', m: 'Я помогу записаться к мастеру' },
                { t: 'user', m: '💅 Маникюр' },
                { t: 'bot', m: '💅 Выберите вид маникюра:' },
                { t: 'bot', m: 'Классический - 1 500₽\nАппаратный - 2 000₽\nГель-лак - 2 800₽' },
                { t: 'user', m: 'Гель-лак - 2 800₽' },
                { t: 'bot', m: '💅 Гель-лак - 2 800₽\nДлительность: ~1.5 часа' },
                { t: 'bot', m: 'Выберите мастера:' },
                { t: 'bot', m: '👩‍🎨 Анна  ⭐ 4.9 · 234 отзыва' },
                { t: 'bot', m: '👩 Мария  ⭐ 4.8 · 187 отзывов' },
                { t: 'user', m: 'Анна ⭐ 4.9' },
                { t: 'bot', m: '📅 Свободные слоты у Анны:' },
                { t: 'bot', m: 'Сегодня: 14:00 · 16:30 · 18:00' },
                { t: 'user', m: '📅 Сегодня, 16:30' },
                { t: 'bot', m: '✅ Вы записаны!\n💅 Маникюр + гель-лак\n👩‍🎨 Мастер: Анна\n📅 Сегодня, 16:30' },
            ]
        },
        clinic: {
            emoji: '🏥', color: '#4FC3F7',
            msgs: [
                { t: 'bot', m: 'Здравствуйте! 🏥\nКлиника «Здоровье Плюс»' },
                { t: 'bot', m: 'Чем могу помочь?' },
                { t: 'user', m: '📋 Запись к врачу' },
                { t: 'bot', m: '👨‍⚕️ Выберите специализацию:' },
                { t: 'bot', m: '🫀 Кардиолог\n🧠 Невролог\n🦷 Стоматолог' },
                { t: 'user', m: '🫀 Кардиолог' },
                { t: 'bot', m: '👨‍⚕️ Иванов А.С.\n⭐ 4.9 · 312 отзывов\nОпыт: 15 лет' },
                { t: 'user', m: 'Иванов А.С. ⭐ 4.9' },
                { t: 'bot', m: '📅 Расписание Иванова А.С.:' },
                { t: 'bot', m: 'Пн: 09:00 · 09:30 · 10:30\nСр: 10:00 · 11:00 · 15:00' },
                { t: 'user', m: '📅 Пн, 09:30' },
                { t: 'bot', m: '✅ Запись подтверждена!\n🏥 ЭКГ + консультация\n👨‍⚕️ Иванов А.С.\n📅 Пн, 09:30' },
            ]
        },
        'shop-flowers': {
            emoji: '💐', color: '#66BB6A',
            msgs: [
                { t: 'bot', m: '💐 Добро пожаловать в FlowerShop!' },
                { t: 'bot', m: 'Закажите букет с доставкой 🚚' },
                { t: 'user', m: '💐 Букеты' },
                { t: 'bot', m: '💐 Наши популярные букеты:' },
                { t: 'bot', m: '🌹 Нежность - 2 990₽\n🌷 Весенний - 3 490₽\n🌻 Яркий микс - 4 200₽' },
                { t: 'user', m: 'Нежность 💐' },
                { t: 'bot', m: '💐 Букет «Нежность»\n🌹 15 роз, эвкалипт\n💰 2 990₽\n⭐ 4.9 (87 отзывов)' },
                { t: 'user', m: '💝 Добавить открытку' },
                { t: 'user', m: 'С 8 марта! 💖' },
                { t: 'bot', m: '✅ Открытка добавлена!' },
                { t: 'bot', m: '🛒 Итого: 2 990₽' },
                { t: 'user', m: '📅 Сб, 8 марта - 08:00' },
                { t: 'bot', m: '🎉 Заказ оформлен!\n💐 Букет «Нежность»\n📅 Сб, 8 марта\n💰 2 990₽ ✅' },
            ]
        },
        'shop-electronics': {
            emoji: '⚡', color: '#FFB74D',
            msgs: [
                { t: 'bot', m: '⚡ Привет! Это TechStore' },
                { t: 'user', m: '🎧 Наушники' },
                { t: 'bot', m: '🎧 AirPods Pro 2 - 24 990₽\n🎧 Sony WH-1000XM5 - 29 990₽' },
                { t: 'user', m: 'AirPods Pro 2' },
                { t: 'bot', m: '✅ Добавлено в корзину!\n🛒 1 товар - 24 990₽' },
            ]
        },
        'parser-prices': {
            emoji: '📊', color: '#7E57C2',
            msgs: [
                { t: 'bot', m: '📊 GERS Price Monitor v2.1' },
                { t: 'bot', m: 'Отчёт за 5 марта 2026:' },
                { t: 'bot', m: 'Обработано: 2,847 товаров\nИсточников: 52 сайта' },
                { t: 'bot', m: '📈 Средний рост: +3.2%\n📉 Средний спад: -1.8%' },
                { t: 'user', m: '📥 Скачать отчёт' },
                { t: 'bot', m: '✅ Отчёт отправлен на email' },
            ]
        },
        'parser-avito': {
            emoji: '🔍', color: '#26A69A',
            msgs: [
                { t: 'bot', m: '🔍 Avito Parser - мониторинг' },
                { t: 'bot', m: '📋 Ваши фильтры:\nМосква · Электроника\nЦена: 5 000-50 000₽' },
                { t: 'bot', m: '🆕 3 новых объявления!' },
                { t: 'bot', m: '📱 iPhone 14 Pro - 45 000₽\n🕐 2 мин. назад' },
                { t: 'user', m: '👀 Подробнее' },
            ]
        },
        'doc-gen': {
            emoji: '📄', color: '#5C6BC0',
            msgs: [
                { t: 'bot', m: '📄 GERS DocGen v1.2' },
                { t: 'user', m: '📝 Создать договор' },
                { t: 'bot', m: 'Выберите шаблон:\n📋 Договор разработки ПО\n📋 NDA\n📋 Договор оказания услуг' },
                { t: 'user', m: '📋 Договор разработки ПО' },
                { t: 'bot', m: '✅ Документ сгенерирован!\n📝 №GERS-2026-0341\n💰 450 000₽' },
            ]
        },
        'parser-contacts': {
            emoji: '📇', color: '#8D6E63',
            msgs: [
                { t: 'bot', m: '📇 ContactScraper v3.0' },
                { t: 'bot', m: 'Каталоги для парсинга:\n🏢 2GIS · ЯндексСправка · HH.ru' },
                { t: 'user', m: '🏢 2GIS - рестораны, Москва' },
                { t: 'bot', m: '⏳ Сбор данных... 1 247 компаний' },
                { t: 'bot', m: '✅ Найдено:\n📧 892 email\n📞 1 103 телефона\n🏢 1 247 адресов' },
                { t: 'user', m: '📥 Экспорт в Excel' },
                { t: 'bot', m: '✅ contacts_restoran_msk.xlsx отправлен!' },
            ]
        },
        'auto-posting': {
            emoji: '📱', color: '#E91E63',
            msgs: [
                { t: 'bot', m: '📱 AutoPost - планировщик' },
                { t: 'bot', m: '📅 Запланировано на сегодня:\n10:00 - Instagram пост\n14:00 - VK сторис\n18:00 - Telegram пост' },
                { t: 'user', m: '➕ Новый пост' },
                { t: 'bot', m: '📸 Загрузите фото или видео' },
                { t: 'user', m: '🖼️ photo_product.jpg' },
                { t: 'bot', m: '✅ Пост создан!\n📱 Instagram + VK + Telegram\n📅 Завтра, 12:00' },
            ]
        },
        'auto-email': {
            emoji: '📧', color: '#FF7043',
            msgs: [
                { t: 'bot', m: '📧 Email-рассылка GERS' },
                { t: 'bot', m: 'Кампания: «Весенняя акция»\n👥 База: 15 400 подписчиков' },
                { t: 'user', m: '🚀 Запустить рассылку' },
                { t: 'bot', m: '⏳ Отправка: 15 400 писем...' },
                { t: 'bot', m: '✅ Отправлено!\n📬 Доставлено: 14 890\n👀 Открыли: 4 230 (28.4%)' },
            ]
        },
        'auto-docs': {
            emoji: '📋', color: '#42A5F5',
            msgs: [
                { t: 'bot', m: '📋 AutoDocs - генерация' },
                { t: 'user', m: '📝 Акт выполненных работ' },
                { t: 'bot', m: 'Заполните данные:\n🏢 Заказчик: ООО «Тест»\n💰 Сумма: 150 000₽' },
                { t: 'user', m: '✅ Подтвердить' },
                { t: 'bot', m: '✅ Акт №127 сгенерирован!\n📄 PDF: act_127.pdf' },
            ]
        },
        'booking-hotel': {
            emoji: '🏨', color: '#AB47BC',
            msgs: [
                { t: 'bot', m: '🏨 HotelBot - бронирование' },
                { t: 'user', m: '🔍 Москва, 15-18 марта' },
                { t: 'bot', m: '🏨 Найдено 23 отеля:\n⭐⭐⭐⭐ Cosmos - 8 500₽/ночь\n⭐⭐⭐⭐⭐ Ritz - 25 000₽/ночь' },
                { t: 'user', m: '🏨 Cosmos ⭐⭐⭐⭐' },
                { t: 'bot', m: '✅ Забронировано!\n🏨 Cosmos · 15-18 марта\n💰 25 500₽ · 3 ночи' },
            ]
        },
        pizza: {
            emoji: '🍕', color: '#FF6B35',
            msgs: [
                { t: 'bot', m: '🍕 PizzaBot - заказ пиццы' },
                { t: 'bot', m: 'Привет! Я помогу заказать пиццу' },
                { t: 'user', m: '🍕 Меню' },
                { t: 'bot', m: 'Выберите категорию:\nКлассические · Фирменные\nОстрые · Вегетарианские' },
                { t: 'user', m: 'Фирменные' },
                { t: 'bot', m: '⭐ Пепперони Делюкс - 599₽\n⭐ Четыре сыра - 649₽\n⭐ Мясная BBQ - 699₽' },
                { t: 'user', m: 'В корзину' },
                { t: 'bot', m: '✅ Пепперони добавлена!\n🛒 Корзина: 1 товар - 599₽' },
            ]
        }
    };

    const botCards = document.querySelectorAll('.bento-card[data-bot-preview]');
    botCards.forEach(card => {
        const previewType = card.getAttribute('data-bot-preview');
        const chatData = botCardMessages[previewType];
        if (!chatData) return;

        // Remove gradient background
        const gradBg = card.querySelector('.bento-card-bg--gradient');
        if (gradBg) gradBg.remove();

        // Build mini chat HTML
        const msgsHTML = chatData.msgs.map(m => {
            const cls = m.t === 'user' ? 'mini-chat-msg mini-chat-user' : 'mini-chat-msg mini-chat-bot';
            return `<div class="${cls}"><span>${m.m.replace(/\n/g, '<br>')}</span></div>`;
        }).join('');

        // Duplicate messages for seamless loop
        const miniChat = document.createElement('div');
        miniChat.className = 'mini-chat-preview';
        miniChat.style.setProperty('--bot-accent', chatData.color);
        miniChat.innerHTML = `
            <div class="mini-chat-scroll">
                ${msgsHTML}
                ${msgsHTML}
            </div>
        `;

        // Insert after glow, before overlay
        const overlay = card.querySelector('.bento-card-overlay');
        if (overlay) {
            card.insertBefore(miniChat, overlay);
        } else {
            card.appendChild(miniChat);
        }

        // Set animation duration based on message count
        const scrollEl = miniChat.querySelector('.mini-chat-scroll');
        const duration = chatData.msgs.length * 3;
        scrollEl.style.animationDuration = duration + 's';
    });

    /* ── 7. Mini dashboard preview on web-preview cards ── */
    const webCardPreviews = {
        'integration-1c': {
            accent: '#3B82F6',
            title: '1С Синхронизация',
            stats: [
                { v: '14 230', l: 'Товаров', c: '#3B82F6' },
                { v: '99.8%', l: 'Успех', c: '#4ADE80' },
                { v: '3.2с', l: 'Скорость', c: '#F59E0B' }
            ],
            rows: [
                { icon: '✓', st: 'ok', code: 'АРТ-001247', name: 'Кроссовки Nike Air Max', price: '12 990 ₽', stock: '24', time: '14:32:05' },
                { icon: '✓', st: 'ok', code: 'АРТ-003891', name: 'Футболка Adidas Originals', price: '4 290 ₽', stock: '67', time: '14:32:04' },
                { icon: '⚠', st: 'warn', code: 'АРТ-005512', name: 'Джинсы Levi\'s 501', price: '8 490 ₽', stock: '3', time: '14:31:58' },
                { icon: '✓', st: 'ok', code: 'АРТ-002190', name: 'Рюкзак The North Face', price: '7 990 ₽', stock: '15', time: '14:31:52' },
                { icon: '✓', st: 'ok', code: 'АРТ-008734', name: 'Куртка Columbia Omni-Heat', price: '18 990 ₽', stock: '8', time: '14:31:45' },
                { icon: '⚠', st: 'warn', code: 'АРТ-004420', name: 'Кеды Converse Chuck 70', price: '6 990 ₽', stock: '0', time: '14:31:39' },
                { icon: '✓', st: 'ok', code: 'АРТ-007610', name: 'Пуховик Uniqlo Ultra Light', price: '9 490 ₽', stock: '31', time: '14:31:30' },
                { icon: '✓', st: 'ok', code: 'АРТ-001890', name: 'Худи Puma Essentials', price: '5 490 ₽', stock: '42', time: '14:31:22' }
            ]
        },
        'integration-acquiring': {
            accent: '#10B981',
            title: 'Платежи',
            stats: [
                { v: '287 430₽', l: 'Сегодня', c: '#10B981' },
                { v: '247', l: 'Транзакций', c: '#3B82F6' },
                { v: '98.4%', l: 'Конверсия', c: '#F59E0B' }
            ],
            rows: [
                { id: '#TXN-8834', method: 'Visa', card: '•••• 4521', amount: '4 290 ₽', status: 'success', time: '14:33' },
                { id: '#TXN-8833', method: 'MIR', card: '•••• 7891', amount: '12 990 ₽', status: 'success', time: '14:31' },
                { id: '#TXN-8832', method: 'MC', card: '•••• 3344', amount: '890 ₽', status: 'refund', time: '14:28' },
                { id: '#TXN-8831', method: 'СБП', card: 'Сбер', amount: '6 500 ₽', status: 'success', time: '14:25' },
                { id: '#TXN-8830', method: 'Visa', card: '•••• 9012', amount: '18 990 ₽', status: 'success', time: '14:22' },
                { id: '#TXN-8829', method: 'YooKassa', card: 'Кошелёк', amount: '3 200 ₽', status: 'pending', time: '14:19' },
                { id: '#TXN-8828', method: 'MC', card: '•••• 6677', amount: '7 490 ₽', status: 'success', time: '14:15' },
                { id: '#TXN-8827', method: 'MIR', card: '•••• 2233', amount: '15 600 ₽', status: 'success', time: '14:11' }
            ]
        },
        'integration-crm': {
            accent: '#8B5CF6',
            title: 'CRM Воронка',
            stats: [
                { v: '156', l: 'Лидов', c: '#8B5CF6' },
                { v: '34%', l: 'Конверсия', c: '#4ADE80' },
                { v: '1.2M₽', l: 'Воронка', c: '#F59E0B' }
            ],
            pipeline: [
                { name: 'Новые', count: 42, color: '#3B82F6', leads: ['Сергей М.', 'Анна К.', 'Дмитрий В.'] },
                { name: 'Квалификация', count: 28, color: '#8B5CF6', leads: ['Ольга С.', 'Максим П.'] },
                { name: 'КП отправлено', count: 15, color: '#F59E0B', leads: ['Елена Р.', 'Игорь Т.'] },
                { name: 'Переговоры', count: 8, color: '#EC4899', leads: ['Павел Л.'] },
                { name: 'Закрыто ✓', count: 5, color: '#4ADE80', leads: ['Виктор Н.'] }
            ]
        },
        'ai-support': {
            accent: '#A855F7',
            title: 'AI Ассистент',
            stats: [
                { v: '1 247', l: 'Диалогов', c: '#A855F7' },
                { v: '94%', l: 'AI решено', c: '#4ADE80' },
                { v: '12с', l: 'Ответ', c: '#3B82F6' }
            ],
            chats: [
                { user: 'Клиент', q: 'Как отследить заказ?', a: 'Введите номер заказа и я покажу статус доставки в реальном времени 📦', status: 'ai' },
                { user: 'Покупатель', q: 'Хочу вернуть товар', a: 'Конечно! Оформлю заявку на возврат. Укажите причину и номер заказа', status: 'ai' },
                { user: 'Клиент', q: 'Не приходит SMS с кодом', a: 'Проверяю систему... SMS отправлено повторно на ваш номер ✓', status: 'ai' },
                { user: 'Гость', q: 'Какие есть скидки?', a: 'Сейчас действует промокод SPRING25 на -25% для новых клиентов! 🎉', status: 'ai' },
                { user: 'Покупатель', q: 'Оплата не прошла', a: 'Вижу ошибку банка. Попробуйте другую карту или СБП - переведу на оператора', status: 'operator' },
                { user: 'Клиент', q: 'Когда будет доставка?', a: 'Заказ #4821 уже в пути! Ожидаемое время: сегодня 15:00-17:00 🚚', status: 'ai' },
                { user: 'Гость', q: 'Есть ли размер M?', a: 'Да, размер M в наличии - 3 шт. Добавить в корзину? 🛒', status: 'ai' },
                { user: 'Покупатель', q: 'Как изменить адрес?', a: 'Адрес обновлён! Новый: ул. Ленина 42, кв. 15 ✓', status: 'ai' }
            ]
        }
    };

    const webCards = document.querySelectorAll('.bento-card[data-web-preview]');
    webCards.forEach(card => {
        const previewType = card.getAttribute('data-web-preview');
        const data = webCardPreviews[previewType];
        if (!data) return;

        // Remove gradient background
        const gradBg = card.querySelector('.bento-card-bg--gradient');
        if (gradBg) gradBg.remove();

        let contentHTML = '';

        if (previewType === 'integration-1c') {
            // 1C - Product sync table
            const rowsHTML = data.rows.map(r => `
                <div class="mdash-row">
                    <span class="mdash-icon mdash-icon--${r.st}">${r.icon}</span>
                    <span class="mdash-code">${r.code}</span>
                    <span class="mdash-name">${r.name}</span>
                    <span class="mdash-price">${r.price}</span>
                    <span class="mdash-stock ${r.stock === '0' ? 'mdash-stock--zero' : r.stock <= 5 ? 'mdash-stock--low' : ''}">${r.stock} шт</span>
                </div>
            `).join('');

            contentHTML = `
                <div class="mdash-header">
                    <span class="mdash-logo" style="background:${data.accent}">1С</span>
                    <span class="mdash-title">${data.title}</span>
                    <span class="mdash-live"><span class="mdash-live-dot" style="background:${data.accent};box-shadow:0 0 6px ${data.accent}"></span>Online</span>
                </div>
                <div class="mdash-stats">
                    ${data.stats.map(s => `<div class="mdash-stat"><div class="mdash-stat-val" style="color:${s.c}">${s.v}</div><div class="mdash-stat-lbl">${s.l}</div></div>`).join('')}
                </div>
                <div class="mdash-table">${rowsHTML}${rowsHTML}</div>
            `;
        } else if (previewType === 'integration-acquiring') {
            // Acquiring - Transaction list
            const txnHTML = data.rows.map(r => {
                const stCls = r.status === 'success' ? 'mdash-badge--ok' : r.status === 'refund' ? 'mdash-badge--warn' : 'mdash-badge--pending';
                const stText = r.status === 'success' ? '✓' : r.status === 'refund' ? '↩' : '⏳';
                return `
                    <div class="mdash-txn">
                        <span class="mdash-badge ${stCls}">${stText}</span>
                        <span class="mdash-txn-method">${r.method} <span class="mdash-txn-card">${r.card}</span></span>
                        <span class="mdash-txn-amount">${r.amount}</span>
                        <span class="mdash-txn-time">${r.time}</span>
                    </div>
                `;
            }).join('');

            contentHTML = `
                <div class="mdash-header">
                    <span class="mdash-logo" style="background:${data.accent}">₽</span>
                    <span class="mdash-title">${data.title}</span>
                    <span class="mdash-live"><span class="mdash-live-dot" style="background:${data.accent};box-shadow:0 0 6px ${data.accent}"></span>Live</span>
                </div>
                <div class="mdash-stats">
                    ${data.stats.map(s => `<div class="mdash-stat"><div class="mdash-stat-val" style="color:${s.c}">${s.v}</div><div class="mdash-stat-lbl">${s.l}</div></div>`).join('')}
                </div>
                <div class="mdash-table">${txnHTML}${txnHTML}</div>
            `;
        } else if (previewType === 'integration-crm') {
            // CRM - Pipeline funnel
            const pipeHTML = data.pipeline.map(p => `
                <div class="mdash-pipe-col" style="--pipe-color:${p.color}">
                    <div class="mdash-pipe-count" style="color:${p.color}">${p.count}</div>
                    <div class="mdash-pipe-bar" style="height:${Math.round(p.count / 42 * 100)}%;background:${p.color}"></div>
                    <div class="mdash-pipe-name">${p.name}</div>
                    ${p.leads.map(l => `<div class="mdash-pipe-lead">${l}</div>`).join('')}
                </div>
            `).join('');

            contentHTML = `
                <div class="mdash-header">
                    <span class="mdash-logo" style="background:${data.accent}">⬡</span>
                    <span class="mdash-title">${data.title}</span>
                    <span class="mdash-live"><span class="mdash-live-dot" style="background:${data.accent};box-shadow:0 0 6px ${data.accent}"></span>Live</span>
                </div>
                <div class="mdash-stats">
                    ${data.stats.map(s => `<div class="mdash-stat"><div class="mdash-stat-val" style="color:${s.c}">${s.v}</div><div class="mdash-stat-lbl">${s.l}</div></div>`).join('')}
                </div>
                <div class="mdash-pipeline">${pipeHTML}</div>
            `;
        } else if (previewType === 'ai-support') {
            // AI - Chat conversation list
            const chatsHTML = data.chats.map(c => {
                const stCls = c.status === 'ai' ? 'mdash-ai-st--ai' : 'mdash-ai-st--op';
                const stIcon = c.status === 'ai' ? '🤖' : '👤';
                return `
                    <div class="mdash-ai-conv">
                        <div class="mdash-ai-q">
                            <span class="mdash-ai-user">${c.user}</span>
                            <span class="mdash-ai-qtext">${c.q}</span>
                        </div>
                        <div class="mdash-ai-a">
                            <span class="mdash-ai-badge ${stCls}">${stIcon} ${c.status === 'ai' ? 'AI' : 'Оператор'}</span>
                            <span class="mdash-ai-atext">${c.a}</span>
                        </div>
                    </div>
                `;
            }).join('');

            contentHTML = `
                <div class="mdash-header">
                    <span class="mdash-logo" style="background:${data.accent}">🤖</span>
                    <span class="mdash-title">${data.title}</span>
                    <span class="mdash-live"><span class="mdash-live-dot" style="background:${data.accent};box-shadow:0 0 6px ${data.accent}"></span>24/7</span>
                </div>
                <div class="mdash-stats">
                    ${data.stats.map(s => `<div class="mdash-stat"><div class="mdash-stat-val" style="color:${s.c}">${s.v}</div><div class="mdash-stat-lbl">${s.l}</div></div>`).join('')}
                </div>
                <div class="mdash-table">${chatsHTML}${chatsHTML}</div>
            `;
        }

        const miniDash = document.createElement('div');
        miniDash.className = 'mini-dash-preview';
        miniDash.style.setProperty('--dash-accent', data.accent);
        miniDash.innerHTML = contentHTML;

        const overlay = card.querySelector('.bento-card-overlay');
        if (overlay) {
            card.insertBefore(miniDash, overlay);
        } else {
            card.appendChild(miniDash);
        }
    });

})();
