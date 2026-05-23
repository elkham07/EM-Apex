# EM Apex Platform — Comprehensive Implementation Plan

## 1. Title
End-to-End Implementation of EM Apex — Closed Community Platform for Digital Product Creation Using Microservices, Docker, Docker Swarm, Terraform, and SRE Practices

## 2. Abstract
EM Apex — это закрытая комьюнити платформа, где участники (воркеры) выполняют цифровые задания и получают оплату, а администраторы создают задания и управляют платформой. Система построена на микросервисной архитектуре с двумя отдельными фронтендами — публичным для воркеров и секретным для админов.
Проект включает контейнеризацию через Docker, оркестрацию через **Docker Swarm**, провижининг инфраструктуры через Terraform, мониторинг через Prometheus и Grafana, асинхронную очередь сообщений через NATS, кэширование через Redis, и автоматические email уведомления через SMTP.

## 3. Цели проекта
- Спроектировать и задеплоить закрытую комьюнити платформу с двумя ролями
- Реализовать микросервисную архитектуру (6 сервисов)
- Настроить оркестрацию через **Docker Swarm** (расчетная нагрузка до 5000 пользователей)
- Провижинить инфраструктуру через Terraform
- Реализовать мониторинг через Prometheus и Grafana
- Настроить асинхронные события через NATS
- Подключить платёжную систему Stripe
- Задеплоить на AWS/Google Cloud с реальным доменом

## 4. Обзор системы
**Две роли:**
- **Worker (публичный)** — заходит на `emapex.com/join`, регистрируется, видит только свои задания, заработок и профиль.
- **Admin (секретный)** — заходит на `emapex.com/admin`, видит всю платформу, создаёт задания, одобряет работы, управляет участниками и выплатами.

## 5. Микросервисы
1. **Auth Service** (Порт: 3001) — регистрация, вход, JWT, Google OAuth, управление ролями (worker/admin).
2. **Task Service** (Порт: 3002) — создание заданий админом, список для воркеров, статусы (active/closed).
3. **Submission Service** (Порт: 3003) — сдача работы, проверка админом, хранение файлов.
4. **Payment Service** (Порт: 3004) — начисление оплаты, Stripe, история выплат.
5. **Notification Service** (Порт: 3005) — email при регистрации/одобрении/оплате, SMTP.
6. **User Profile Service** (Порт: 3006) — профиль, уровни/XP, статистика заработка.

## 6. Архитектура системы
```text
Worker App (emapex.com/)
Admin App (emapex.com/admin)
          |
       [Nginx]
          |
    [API Gateway]
          |
    ┌─────┼──────┬──────┬──────┬──────┐
    ↓     ↓      ↓      ↓      ↓      ↓
  Auth  Task  Submit  Pay  Notify Profile
    |     |      |      |      |      |
    └─────┴──────┴──────┴──────┴──────┘
                    |
              [PostgreSQL]
                    |
               [Redis Cache]
                    |
            [NATS Message Bus]
                    |
         [Prometheus + Grafana]
```

## 7. Стек технологий
- **Frontend:** React / Next.js
- **Backend:** Node.js + Express / FastAPI
- **Database:** PostgreSQL
- **Cache:** Redis
- **Auth:** JWT + Google OAuth
- **Payments:** Stripe
- **Messaging:** NATS
- **Monitoring:** Prometheus + Grafana
- **Деплой:** Docker + Docker Swarm + AWS/GCP
- **Домен:** emapex.com

## 8. Структура файлов
```
em-apex/
├── worker-app/
├── admin-app/
├── services/
│   ├── auth-service/
│   ├── task-service/
│   ├── submission-service/
│   ├── payment-service/
│   ├── notification-service/
│   └── profile-service/
├── api-gateway/
├── docker-compose.yml
├── terraform/
└── docs/
    └── PLAN.md
```

## 9. Docker и деплой
- **Этап 1 — Локально:** `docker-compose.yml` поднимает все сервисы для разработки.
- **Этап 2 — Docker Swarm (до 5000+ юзеров):** 
  - `docker swarm init`
  - `docker stack deploy -c docker-compose.yml emapex`
  - Балансировка нагрузки, репликация сервисов, rolling updates.
- **Этап 3 — Terraform:** Провижининг VM на AWS/GCP, настройка сети.

## 10. NATS — асинхронные события
- **Воркер сдал работу:** NATS `submission.created` → Notification Service (email админу)
- **Админ одобрил работу:** NATS `submission.approved` → Payment Service (начисляет деньги) + Notification Service (email воркеру)
- **Деньги начислены:** NATS `payment.completed` → Profile Service (обновляет XP)

## 11. Мониторинг — Grafana
Метрики: онлайн воркеры, сданные задания, выплаты за месяц, CPU/RAM, время ответа API, ошибки.

## 12. SLI / SLO
- Доступность платформы: ≥ 99%
- Время ответа API: ≤ 200ms
- Процент ошибок: ≤ 1%
- Время одобрения работы: ≤ 24 часа
- Время выплаты: ≤ 1 час после одобрения
